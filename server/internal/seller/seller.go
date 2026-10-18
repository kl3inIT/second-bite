// Package seller holds the businesses that sell surplus: who opened each, its
// status set by admins, and the accounts that act for it. The flow follows
// Open Food Network (one owner, staff added by email, five sellers per owner)
// and Spree multi-vendor (pending until an admin activates it; rights only
// through an active seller).
package seller

import (
	"context"
	"errors"
	"fmt"
	"log/slog"
	"strings"
	"time"
	"unicode"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"

	"github.com/kl3inIT/second-bite/server/internal/file"
	"github.com/kl3inIT/second-bite/server/internal/identity"
	"github.com/kl3inIT/second-bite/server/internal/platform"
	"github.com/kl3inIT/second-bite/server/internal/seller/internal/db"
)

const (
	// maxOwnedSellers is Open Food Network's default enterprise_limit.
	maxOwnedSellers = 5
	// maxMembers bounds the people one seller can add, since they are added
	// without accepting: an owner cannot attach a seller to many addresses.
	maxMembers = 30
)

// Status is where a seller stands with the admins.
type Status string

// The statuses of a seller.
const (
	StatusPending Status = "pending"
	StatusActive  Status = "active"
	StatusBlocked Status = "blocked"
)

// Role is what an account is to one seller.
type Role string

// The roles in a seller.
const (
	RoleOwner Role = "owner"
	RoleStaff Role = "staff"
)

// Seller is a business that sells surplus.
type Seller struct {
	ID              uuid.UUID
	Name            string
	Address         string
	Latitude        float64
	Longitude       float64
	Phone           string
	Status          Status
	StatusChangedAt *time.Time
	CreatedAt       time.Time
	UpdatedAt       time.Time
	// PhotoID is the seller's photo, kept by media; nil when it has none.
	PhotoID *uuid.UUID
	// MyRole is the caller's role in the seller; empty for an admin who is
	// not a member.
	MyRole Role
}

// Details are what an owner enters and changes.
type Details struct {
	Name      string
	Address   string
	Latitude  float64
	Longitude float64
	Phone     string
}

// Member is an account that acts for a seller.
type Member struct {
	AccountID uuid.UUID
	Email     string
	Role      Role
	AddedAt   time.Time
}

// Service is the module's published API.
type Service struct {
	pool     *pgxpool.Pool
	queries  *db.Queries
	accounts *identity.Service
	photos   *file.Service
	logger   *slog.Logger
}

// NewService assembles the module.
func NewService(pool *pgxpool.Pool, accounts *identity.Service, photos *file.Service, logger *slog.Logger) *Service {
	return &Service{pool: pool, queries: db.New(pool), accounts: accounts, photos: photos, logger: logger}
}

// Open opens a seller for the caller, who becomes its owner. It is pending
// until an admin activates it.
func (s *Service) Open(ctx context.Context, d Details) (Seller, error) {
	caller, err := platform.RequireCaller(ctx)
	if err != nil {
		return Seller{}, err
	}

	d, err = d.normalized()
	if err != nil {
		return Seller{}, err
	}

	var id uuid.UUID

	err = pgx.BeginFunc(ctx, s.pool, func(tx pgx.Tx) error {
		q := s.queries.WithTx(tx)

		if err := q.LockAccount(ctx, caller.AccountID.String()); err != nil {
			return fmt.Errorf("locking the owner: %w", err)
		}

		owned, err := q.CountOwnedSellers(ctx, caller.AccountID)
		if err != nil {
			return fmt.Errorf("counting the owner's sellers: %w", err)
		}

		if owned >= maxOwnedSellers {
			return ErrLimitReached
		}

		id, err = q.InsertSeller(ctx, db.InsertSellerParams{
			Name: d.Name, Address: d.Address, Latitude: d.Latitude, Longitude: d.Longitude, Phone: d.Phone,
		})
		if err != nil {
			return fmt.Errorf("storing the seller: %w", err)
		}

		if _, err := q.InsertMember(ctx, db.InsertMemberParams{SellerID: id, AccountID: caller.AccountID, Role: string(RoleOwner)}); err != nil {
			return fmt.Errorf("storing the owner: %w", err)
		}

		return nil
	})
	if err != nil {
		return Seller{}, err
	}

	s.logger.InfoContext(ctx, "seller opened",
		slog.String("event", "seller.seller.opened"),
		slog.String("seller_id", id.String()),
		slog.String("account_id", caller.AccountID.String()),
	)

	return s.Get(ctx, id)
}

// Mine returns the sellers the caller owns or works for.
func (s *Service) Mine(ctx context.Context) ([]Seller, error) {
	caller, err := platform.RequireCaller(ctx)
	if err != nil {
		return nil, err
	}

	rows, err := s.queries.SellersOfAccount(ctx, caller.AccountID)
	if err != nil {
		return nil, fmt.Errorf("reading the sellers: %w", err)
	}

	sellers := make([]Seller, 0, len(rows))
	for _, r := range rows {
		sellers = append(sellers, Seller{
			ID: r.ID, Name: r.Name, Address: r.Address, Latitude: r.Latitude, Longitude: r.Longitude, Phone: r.Phone,
			Status: Status(r.Status), StatusChangedAt: r.StatusChangedAt, CreatedAt: r.CreatedAt, UpdatedAt: r.UpdatedAt,
			PhotoID: nullUUID(r.PhotoID), MyRole: Role(r.Role),
		})
	}

	return sellers, nil
}

// Get returns a seller to its members and to admins. Anyone else gets
// ErrNotFound, so the existence of a seller is not revealed.
func (s *Service) Get(ctx context.Context, id uuid.UUID) (Seller, error) {
	caller, err := platform.RequireCaller(ctx)
	if err != nil {
		return Seller{}, err
	}

	role, err := s.roleOf(ctx, id, caller)
	if err != nil {
		return Seller{}, err
	}

	row, err := s.queries.GetSeller(ctx, id)
	if errors.Is(err, pgx.ErrNoRows) {
		return Seller{}, ErrNotFound
	}

	if err != nil {
		return Seller{}, fmt.Errorf("reading the seller: %w", err)
	}

	return fromRow(row, role), nil
}

// Update changes a seller's details. Only its owner may.
func (s *Service) Update(ctx context.Context, id uuid.UUID, d Details) (Seller, error) {
	if _, err := s.requireOwner(ctx, id); err != nil {
		return Seller{}, err
	}

	d, err := d.normalized()
	if err != nil {
		return Seller{}, err
	}

	if err := s.queries.UpdateSeller(ctx, db.UpdateSellerParams{
		ID: id, Name: d.Name, Address: d.Address, Latitude: d.Latitude, Longitude: d.Longitude, Phone: d.Phone,
	}); err != nil {
		return Seller{}, fmt.Errorf("changing the seller: %w", err)
	}

	return s.Get(ctx, id)
}

// SetPhoto sets the seller's photo, one the owner uploaded, or removes it
// when photoID is nil. Only its owner may.
func (s *Service) SetPhoto(ctx context.Context, id uuid.UUID, photoID *uuid.UUID) (Seller, error) {
	caller, err := s.requireOwner(ctx, id)
	if err != nil {
		return Seller{}, err
	}

	photo := uuid.NullUUID{}

	if photoID != nil {
		if err := s.photos.Claim(ctx, *photoID, caller.AccountID); err != nil {
			return Seller{}, err
		}

		photo = uuid.NullUUID{UUID: *photoID, Valid: true}
	}

	if err := s.queries.SetPhoto(ctx, db.SetPhotoParams{ID: id, PhotoID: photo}); err != nil {
		return Seller{}, fmt.Errorf("setting the seller's photo: %w", err)
	}

	return s.Get(ctx, id)
}

// CollectionPoint is where a seller's offers are collected.
type CollectionPoint struct {
	Latitude  float64
	Longitude float64
	Address   string
}

// Publishing returns where the seller's offers are collected, when account
// may publish for it: ErrNotFound when the account is not the seller's owner
// or staff, ErrNotActive when the seller is not active.
func (s *Service) Publishing(ctx context.Context, sellerID, accountID uuid.UUID) (CollectionPoint, error) {
	_, err := s.queries.MemberRole(ctx, db.MemberRoleParams{SellerID: sellerID, AccountID: accountID})
	if errors.Is(err, pgx.ErrNoRows) {
		return CollectionPoint{}, ErrNotFound
	}

	if err != nil {
		return CollectionPoint{}, fmt.Errorf("reading the caller's role: %w", err)
	}

	row, err := s.queries.GetSeller(ctx, sellerID)
	if err != nil {
		return CollectionPoint{}, fmt.Errorf("reading the seller: %w", err)
	}

	if Status(row.Status) != StatusActive {
		return CollectionPoint{}, ErrNotActive
	}

	return CollectionPoint{Latitude: row.Latitude, Longitude: row.Longitude, Address: row.Address}, nil
}

// roleOf returns the caller's role in the seller, empty for an admin who is
// not a member, or ErrNotFound for anyone else.
func (s *Service) roleOf(ctx context.Context, sellerID uuid.UUID, caller platform.Caller) (Role, error) {
	role, err := s.queries.MemberRole(ctx, db.MemberRoleParams{SellerID: sellerID, AccountID: caller.AccountID})

	switch {
	case err == nil:
		return Role(role), nil
	case errors.Is(err, pgx.ErrNoRows) && caller.Role == platform.RoleAdmin:
		return "", nil
	case errors.Is(err, pgx.ErrNoRows):
		return "", ErrNotFound
	default:
		return "", fmt.Errorf("reading the caller's role: %w", err)
	}
}

// requireOwner returns the caller when they own the seller.
func (s *Service) requireOwner(ctx context.Context, sellerID uuid.UUID) (platform.Caller, error) {
	caller, err := platform.RequireCaller(ctx)
	if err != nil {
		return platform.Caller{}, err
	}

	role, err := s.roleOf(ctx, sellerID, caller)
	if err != nil {
		return platform.Caller{}, err
	}

	if role != RoleOwner {
		return platform.Caller{}, ErrOwnerRequired
	}

	return caller, nil
}

func fromRow(r db.GetSellerRow, role Role) Seller {
	return Seller{
		ID: r.ID, Name: r.Name, Address: r.Address, Latitude: r.Latitude, Longitude: r.Longitude, Phone: r.Phone,
		Status: Status(r.Status), StatusChangedAt: r.StatusChangedAt, CreatedAt: r.CreatedAt, UpdatedAt: r.UpdatedAt,
		PhotoID: nullUUID(r.PhotoID), MyRole: role,
	}
}

func nullUUID(id uuid.NullUUID) *uuid.UUID {
	if !id.Valid {
		return nil
	}

	return &id.UUID
}

// normalized trims the details and normalizes the phone.
func (d Details) normalized() (Details, error) {
	d.Name = strings.TrimSpace(d.Name)
	d.Address = strings.TrimSpace(d.Address)

	if d.Name == "" || d.Address == "" {
		return Details{}, ErrDetailsInvalid
	}

	phone, err := normalizePhone(d.Phone)
	if err != nil {
		return Details{}, err
	}

	d.Phone = phone

	return d, nil
}

// normalizePhone keeps a phone's digits and a leading +, dropping the
// spaces, dots, dashes and brackets people write between them.
func normalizePhone(raw string) (string, error) {
	var phone strings.Builder

	for i, r := range strings.TrimSpace(raw) {
		switch {
		case unicode.IsDigit(r), r == '+' && i == 0:
			phone.WriteRune(r)
		case strings.ContainsRune(" .-()", r):
		default:
			return "", ErrPhoneInvalid
		}
	}

	if digits := len(strings.TrimPrefix(phone.String(), "+")); digits < 9 || digits > 15 {
		return "", ErrPhoneInvalid
	}

	return phone.String(), nil
}
