package file

import (
	"context"
	"errors"
	"fmt"
	"slices"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"

	"github.com/kl3inIT/second-bite/server/internal/file/internal/db"
)

// Store names where files are kept. It is stored with every file, so the
// family is closed: a store is added to this list and to the registry.
type Store string

// The stores the service can keep files in.
const (
	StorePostgres Store = "postgres"
	StoreS3       Store = "s3"
)

var stores = []Store{StorePostgres, StoreS3}

// object is one stored file.
type object struct {
	contentType string
	data        []byte
}

var errObjectNotFound = errors.New("object not found")

// objectStore keeps files by key, for every kind of file the system keeps:
// a key starts with what the file is ("photos/..."). Get answers
// errObjectNotFound for a key it does not hold; Delete of a missing key
// succeeds.
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
			return nil, fmt.Errorf("file store %q has no implementation", s)
		}
	}

	for s := range impls {
		if !slices.Contains(stores, s) {
			return nil, fmt.Errorf("file store %q is not a known store", s)
		}
	}

	return objectStores(impls), nil
}

func (r objectStores) get(s Store) (objectStore, error) {
	store, ok := r[s]
	if !ok {
		return nil, fmt.Errorf("file store %q has no implementation", s)
	}

	return store, nil
}

// postgresObjectStore keeps files in the file_blobs table, as Memos keeps
// attachments in its database: the pilot runs no other service, and one
// backup holds data and files.
type postgresObjectStore struct {
	queries *db.Queries
}

func newPostgresObjectStore(pool *pgxpool.Pool) postgresObjectStore {
	return postgresObjectStore{queries: db.New(pool)}
}

func (s postgresObjectStore) Put(ctx context.Context, key string, o object) error {
	if err := s.queries.PutBlob(ctx, db.PutBlobParams{Key: key, ContentType: o.contentType, Data: o.data}); err != nil {
		return fmt.Errorf("storing %s: %w", key, err)
	}

	return nil
}

func (s postgresObjectStore) Get(ctx context.Context, key string) (object, error) {
	row, err := s.queries.GetBlob(ctx, key)
	if errors.Is(err, pgx.ErrNoRows) {
		return object{}, errObjectNotFound
	}

	if err != nil {
		return object{}, fmt.Errorf("reading %s: %w", key, err)
	}

	return object{contentType: row.ContentType, data: row.Data}, nil
}

func (s postgresObjectStore) Delete(ctx context.Context, key string) error {
	if err := s.queries.DeleteBlob(ctx, key); err != nil {
		return fmt.Errorf("deleting %s: %w", key, err)
	}

	return nil
}
