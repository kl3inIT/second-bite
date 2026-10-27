package offer

import (
	"context"
	"net/http"
	"time"

	"github.com/danielgtaylor/huma/v2"
	"github.com/google/uuid"
)

type dishDetailsBody struct {
	Name        string `json:"name"                  maxLength:"80"   minLength:"1"`
	Kind        Kind   `json:"kind"                  enum:"bakery,prepared_food,ingredients,drinks,mixed_box,dessert,snacks,produce,other"`
	KindLabel   string `json:"kindLabel,omitempty"   doc:"What the seller calls a dish of the kind other; empty for any other kind" maxLength:"30"`
	Unit        string `json:"unit,omitempty"        doc:"What one unit is called; \"suất\" when empty" maxLength:"20"`
	Description string `json:"description,omitempty" maxLength:"1000"`
	Ingredients string `json:"ingredients,omitempty" doc:"What the dish is made of and may contain, allergens included" maxLength:"500"`
	// OriginalPriceVND is only a start for a post; the post sets its own.
	OriginalPriceVND *int64      `json:"originalPriceVnd,omitempty" doc:"What one unit normally sells for; a post starts from it" minimum:"1001"`
	PhotoID          uuid.UUID   `json:"photoId"               doc:"The cover: from POST /photos, or a photo the seller already shows"`
	MorePhotoIDs     []uuid.UUID `json:"morePhotoIds,omitempty" doc:"Up to two more photos after the cover" maxItems:"2" nullable:"false"`
	Hidden           bool        `json:"hidden,omitempty"      doc:"Keeps the dish out of the list a post is picked from"`
}

func (b dishDetailsBody) details() DishDetails { return DishDetails(b) }

type dishChangeBody struct {
	Name        *string `json:"name,omitempty"        maxLength:"80" minLength:"1"`
	Kind        *Kind   `json:"kind,omitempty"        enum:"bakery,prepared_food,ingredients,drinks,mixed_box,dessert,snacks,produce,other"`
	KindLabel   *string `json:"kindLabel,omitempty"   doc:"Leaves it as it is when absent, and empties it when the kind is changed from other" maxLength:"30"`
	Unit        *string `json:"unit,omitempty"        maxLength:"20"`
	Description *string `json:"description,omitempty" maxLength:"1000"`
	Ingredients *string `json:"ingredients,omitempty" maxLength:"500"`
	// 0 takes the original price away.
	OriginalPriceVND *int64       `json:"originalPriceVnd,omitempty" minimum:"0"`
	PhotoID          *uuid.UUID   `json:"photoId,omitempty"`
	MorePhotoIDs     *[]uuid.UUID `json:"morePhotoIds,omitempty" doc:"Replaces the photos after the cover; at most two" maxItems:"2"`
	Hidden           *bool        `json:"hidden,omitempty"`
}

func (b dishChangeBody) change() DishChange { return DishChange(b) }

type dishBody struct {
	ID               uuid.UUID        `json:"id"`
	SellerID         uuid.UUID        `json:"sellerId"`
	Name             string           `json:"name"`
	Kind             Kind             `json:"kind"        enum:"bakery,prepared_food,ingredients,drinks,mixed_box,dessert,snacks,produce,other"`
	KindLabel        string           `json:"kindLabel"   doc:"What the seller calls a dish of the kind other; empty for any other kind"`
	Unit             string           `json:"unit"`
	Description      string           `json:"description"`
	Ingredients      string           `json:"ingredients"`
	OriginalPriceVND *int64           `json:"originalPriceVnd,omitempty"`
	Photo            offerPhotoBody   `json:"photo"`
	Photos           []offerPhotoBody `json:"photos" doc:"Every photo, the cover first" nullable:"false"`
	Hidden           bool             `json:"hidden"`
	CreatedAt        time.Time        `json:"createdAt"`
	UpdatedAt        time.Time        `json:"updatedAt"`
}

func toDishBody(d Dish) dishBody {
	return dishBody{
		ID: d.ID, SellerID: d.SellerID, Name: d.Name, Kind: d.Kind, KindLabel: d.KindLabel, Unit: d.Unit, Description: d.Description,
		Ingredients: d.Ingredients, OriginalPriceVND: d.OriginalPriceVND, Photo: *photoOf(d.PhotoID), Photos: photosOf(d.PhotoID, d.MorePhotoIDs), Hidden: d.Hidden,
		CreatedAt: d.CreatedAt, UpdatedAt: d.UpdatedAt,
	}
}

type dishOutput struct {
	Body dishBody
}

type addDishInput struct {
	SellerID uuid.UUID `path:"sellerId"`
	Body     dishDetailsBody
}

var tagCatalog = []string{"Catalog"}

func registerCatalogOperations(api huma.API, s *Service) {
	huma.Register(api, huma.Operation{
		OperationID: "listDishes", Method: http.MethodGet, Path: "/sellers/{sellerId}/dishes",
		Summary:     "A seller's catalog, the newest dish first, hidden ones included",
		Description: "For the seller's owner and staff; customers see offers, never the catalog.",
		Tags:        tagCatalog, Security: security,
	}, func(ctx context.Context, in *struct {
		SellerID uuid.UUID `path:"sellerId"`
	},
	) (*struct {
		Body struct {
			Dishes []dishBody `json:"dishes" nullable:"false"`
		}
	}, error,
	) {
		dishes, err := s.Dishes(ctx, in.SellerID)
		if err != nil {
			return nil, err
		}

		out := &struct {
			Body struct {
				Dishes []dishBody `json:"dishes" nullable:"false"`
			}
		}{}
		out.Body.Dishes = make([]dishBody, 0, len(dishes))

		for _, d := range dishes {
			out.Body.Dishes = append(out.Body.Dishes, toDishBody(d))
		}

		return out, nil
	})

	huma.Register(api, huma.Operation{
		OperationID: "addDish", Method: http.MethodPost, Path: "/sellers/{sellerId}/dishes",
		Summary:     "Add a dish to a seller's catalog",
		Description: "The stable base of a dish. A post copies it; a later change to the dish does not change a post.",
		Tags:        tagCatalog, Security: security, DefaultStatus: http.StatusCreated,
	}, func(ctx context.Context, in *addDishInput) (*dishOutput, error) {
		d, err := s.AddDish(ctx, in.SellerID, in.Body.details())
		if err != nil {
			return nil, err
		}

		return &dishOutput{Body: toDishBody(d)}, nil
	})

	huma.Register(api, huma.Operation{
		OperationID: "changeDish", Method: http.MethodPatch, Path: "/dishes/{dishId}",
		Summary: "Change a dish, or show or hide it", Tags: tagCatalog, Security: security,
	}, func(ctx context.Context, in *struct {
		DishID uuid.UUID `path:"dishId"`
		Body   dishChangeBody
	},
	) (*dishOutput, error) {
		d, err := s.ChangeDish(ctx, in.DishID, in.Body.change())
		if err != nil {
			return nil, err
		}

		return &dishOutput{Body: toDishBody(d)}, nil
	})

	huma.Register(api, huma.Operation{
		OperationID: "removeDish", Method: http.MethodDelete, Path: "/dishes/{dishId}",
		Summary:     "Delete a dish from the catalog",
		Description: "The offers posted from it are not affected.",
		Tags:        tagCatalog, Security: security, DefaultStatus: http.StatusNoContent,
	}, func(ctx context.Context, in *struct {
		DishID uuid.UUID `path:"dishId"`
	},
	) (*struct{}, error) {
		return nil, s.RemoveDish(ctx, in.DishID)
	})
}
