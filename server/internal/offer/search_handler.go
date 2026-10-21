package offer

import (
	"context"
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/danielgtaylor/huma/v2"
	"github.com/google/uuid"

	"github.com/kl3inIT/second-bite/server/internal/file"
)

// offerSellerBody is what customers see of an offer's seller.
type offerSellerBody struct {
	ID      uuid.UUID       `json:"id"`
	Name    string          `json:"name"`
	Address string          `json:"address"`
	Photo   *offerPhotoBody `json:"photo,omitempty"`
}

// Fields is offerBody under an exported name, so huma lays its fields out in
// foundBody; it skips an unexported embedded struct.
type Fields = offerBody

type foundBody struct {
	Fields

	Seller         offerSellerBody `json:"seller"`
	DistanceMeters *float64        `json:"distanceMeters,omitempty" doc:"From the point searched near; absent without one"`
}

func toFoundBody(f Found) foundBody {
	b := foundBody{
		Fields:         toBody(f.Offer),
		Seller:         offerSellerBody{ID: f.Seller.ID, Name: f.Seller.Name, Address: f.Seller.Address},
		DistanceMeters: f.DistanceMeters,
	}

	if f.Seller.PhotoID != nil {
		b.Seller.Photo = photoOf(*f.Seller.PhotoID)
	}

	return b
}

func photoOf(id uuid.UUID) *offerPhotoBody {
	return &offerPhotoBody{ID: id, LargePath: file.Path(id, file.SizeLarge), SmallPath: file.Path(id, file.SizeSmall)}
}

type searchInput struct {
	Near        string    `doc:"latitude,longitude, such as 21.0565,105.8964"                                               pattern:"^-?[0-9]+(\\.[0-9]+)?,-?[0-9]+(\\.[0-9]+)?$" query:"near"`
	RadiusKm    int       `doc:"Around near; the settings' default when absent, never more than their maximum"             maximum:"100"                                         minimum:"0"   query:"radiusKm"`
	Q           string    `doc:"Words; typed without marks they match any marks (\"ca\" finds cá and cà), with marks only those" maxLength:"200"                                   query:"q"`
	Kind        []Kind    `doc:"One or more kinds, comma-separated"                                                        enum:"bakery,prepared_food,ingredients,drinks,mixed_box,other" query:"kind"`
	MinPrice    int64     `doc:"The lowest price of one unit, in đồng"                                                     minimum:"0"                                           query:"minPrice"`
	MaxPrice    int64     `doc:"The highest price of one unit, in đồng"                                                    minimum:"0"                                           query:"maxPrice"`
	CollectFrom time.Time `doc:"Keep offers whose window overlaps collectFrom to collectTo; both at one moment keep what can be collected then" query:"collectFrom"`
	CollectTo   time.Time `query:"collectTo"`
	SellerID    uuid.UUID `doc:"One seller's offers"                                                                       query:"sellerId"`
	Available   bool      `doc:"Leave out what has sold out"                                                               query:"available"`
	Sort        Sort      `doc:"relevance with q, distance with near, ending_soon otherwise, when absent"                 enum:"relevance,distance,ending_soon,price,discount" query:"sort"`
	Limit       int       `default:"20"                                                                                    maximum:"50"                                          minimum:"1"   query:"limit"`
	Offset      int       `default:"0"                                                                                     minimum:"0"                                           query:"offset"`
}

func (in searchInput) query() (Query, error) {
	q := Query{
		RadiusKm: in.RadiusKm, Words: in.Q, Kinds: in.Kind, MinPriceVND: in.MinPrice, MaxPriceVND: in.MaxPrice, AvailableOnly: in.Available,
		Sort: in.Sort, Limit: in.Limit, Offset: in.Offset,
	}

	if in.Near != "" {
		lat, lng, _ := strings.Cut(in.Near, ",")

		la, errLat := strconv.ParseFloat(lat, 64)
		lo, errLng := strconv.ParseFloat(lng, 64)

		if errLat != nil || errLng != nil {
			return Query{}, ErrSearchInvalid
		}

		q.Near = &Point{Latitude: la, Longitude: lo}
	}

	if !in.CollectFrom.IsZero() {
		q.CollectFrom = &in.CollectFrom
	}

	if !in.CollectTo.IsZero() {
		q.CollectTo = &in.CollectTo
	}

	if in.SellerID != uuid.Nil {
		q.SellerID = &in.SellerID
	}

	return q, nil
}

func registerSearchOperations(api huma.API, s *Service) {
	type foundOutput struct {
		Body struct {
			Offers []foundBody `json:"offers" nullable:"false"`
		}
	}

	huma.Register(api, huma.Operation{
		OperationID: "searchOffers", Method: http.MethodGet, Path: "/offers",
		Summary: "Find offers on sale or sold out, near a point, by words and filters",
		Description: "Anyone may search. Offers sold out are included unless available is set; " +
			"those withdrawn, over or of a blocked seller never are.",
		Tags: tagOffers, Security: optional,
	}, func(ctx context.Context, in *searchInput) (*foundOutput, error) {
		q, err := in.query()
		if err != nil {
			return nil, err
		}

		found, err := s.Search(ctx, q)
		if err != nil {
			return nil, err
		}

		out := &foundOutput{}
		out.Body.Offers = make([]foundBody, 0, len(found))

		for _, f := range found {
			out.Body.Offers = append(out.Body.Offers, toFoundBody(f))
		}

		return out, nil
	})
}
