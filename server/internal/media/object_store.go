package media

import (
	"context"
	"errors"
	"fmt"
	"slices"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"

	"github.com/kl3inIT/second-bite/server/internal/media/internal/db"
)

// Store names where a photo's files are kept. It is stored on every photo, so
// the family is closed: a store is added to this list and to the registry.
type Store string

// The stores the service can keep files in.
const (
	StorePostgres Store = "postgres"
)

var stores = []Store{StorePostgres}

// object is one stored file.
type object struct {
	contentType string
	data        []byte
}

var errObjectNotFound = errors.New("object not found")

// objectStore keeps files by key. Get answers errObjectNotFound for a key it
// does not hold; Delete of a missing key succeeds.
type objectStore interface {
	Put(ctx context.Context, key string, o object) error
	Get(ctx context.Context, key string) (object, error)
	Delete(ctx context.Context, key string) error
}

// objectStores is the registry of stores, built once when the service is
// assembled.
type objectStores map[Store]objectStore

// newObjectStores fails when a store has no implementation or two.
func newObjectStores(impls map[Store]objectStore) (objectStores, error) {
	for _, s := range stores {
		if impls[s] == nil {
			return nil, fmt.Errorf("media store %q has no implementation", s)
		}
	}

	for s := range impls {
		if !slices.Contains(stores, s) {
			return nil, fmt.Errorf("media store %q is not a known store", s)
		}
	}

	return objectStores(impls), nil
}

func (r objectStores) get(s Store) (objectStore, error) {
	store, ok := r[s]
	if !ok {
		return nil, fmt.Errorf("media store %q has no implementation", s)
	}

	return store, nil
}

// postgresObjectStore keeps files in the media_files table: the pilot's store,
// as Memos keeps attachments in its database.
type postgresObjectStore struct {
	queries *db.Queries
}

func newPostgresObjectStore(pool *pgxpool.Pool) postgresObjectStore {
	return postgresObjectStore{queries: db.New(pool)}
}

func (s postgresObjectStore) Put(ctx context.Context, key string, o object) error {
	if err := s.queries.PutFile(ctx, db.PutFileParams{Key: key, ContentType: o.contentType, Data: o.data}); err != nil {
		return fmt.Errorf("storing %s: %w", key, err)
	}

	return nil
}

func (s postgresObjectStore) Get(ctx context.Context, key string) (object, error) {
	row, err := s.queries.GetFile(ctx, key)
	if errors.Is(err, pgx.ErrNoRows) {
		return object{}, errObjectNotFound
	}

	if err != nil {
		return object{}, fmt.Errorf("reading %s: %w", key, err)
	}

	return object{contentType: row.ContentType, data: row.Data}, nil
}

func (s postgresObjectStore) Delete(ctx context.Context, key string) error {
	if err := s.queries.DeleteFile(ctx, key); err != nil {
		return fmt.Errorf("deleting %s: %w", key, err)
	}

	return nil
}
