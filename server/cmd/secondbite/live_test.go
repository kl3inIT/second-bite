package main

import (
	"context"
	"encoding/json"
	"net/http"
	"strings"
	"testing"
	"time"

	"github.com/coder/websocket"
)

const liveWait = 15 * time.Second

// checkLiveSocket has a customer follow an order on GET /live through the
// whole middleware chain, with a ticket minted by the API, and hear the seller
// mark it ready. Only the holder of a ticket may follow.
func checkLiveSocket(t *testing.T, svc service) {
	t.Helper()

	owner := bearer(signIn(t, svc, "live.owner@example.com").Token)
	offerID := postedOffer(t, svc, owner)
	customer := bearer(signIn(t, svc, "live.customer@example.com").Token)
	stranger := bearer(signIn(t, svc, "live.stranger@example.com").Token)

	placing := customer.Clone()
	placing.Set("Idempotency-Key", "live-1")

	var placed orderResponse

	send(t, http.MethodPost, svc.base+"/orders", placing, cartOf(cartLine{offerID, 1})).decode(t, http.StatusCreated, &placed)

	ticketURL := svc.base + "/orders/" + placed.ID + "/live-ticket"

	if p := send(t, http.MethodPost, ticketURL, stranger, nil).problem(t, http.StatusNotFound); p.Code != "ORDER_NOT_FOUND" {
		t.Errorf("a stranger's ticket: %q", p.Code)
	}

	var ticket struct {
		Ticket string `json:"ticket"`
	}

	send(t, http.MethodPost, ticketURL, customer, nil).decode(t, http.StatusOK, &ticket)

	ctx, cancel := context.WithTimeout(t.Context(), liveWait)
	defer cancel()

	conn, _, err := websocket.Dial( //nolint:bodyclose // the library owns the upgrade response
		ctx, "ws"+strings.TrimPrefix(svc.base, "http")+"/live", nil)
	if err != nil {
		t.Fatalf("opening the socket: %v", err)
	}

	defer func() { _ = conn.CloseNow() }()

	subscribe, err := json.Marshal(map[string]string{"type": "subscribe", "ticket": ticket.Ticket})
	if err != nil {
		t.Fatal(err)
	}

	if err := conn.Write(ctx, websocket.MessageText, subscribe); err != nil {
		t.Fatal(err)
	}

	if got := nextFrame(ctx, t, conn); got["type"] != "subscribed" || got["topic"] != "order:"+placed.ID {
		t.Fatalf("subscribing answered %v", got)
	}

	send(t, http.MethodPost, svc.base+"/orders/"+placed.ID+"/ready", owner, nil).decode(t, http.StatusOK, &orderResponse{})

	if got := nextFrame(ctx, t, conn); got["type"] != "order" || got["orderId"] != placed.ID || got["status"] != "ready" {
		t.Errorf("the notice of the order turning ready: %v", got)
	}
}

// nextFrame reads the next frame as an object, leaving out a resync.
func nextFrame(ctx context.Context, t *testing.T, conn *websocket.Conn) map[string]any {
	t.Helper()

	for {
		_, data, err := conn.Read(ctx)
		if err != nil {
			t.Fatalf("reading a frame: %v", err)
		}

		var frame map[string]any
		if err := json.Unmarshal(data, &frame); err != nil {
			t.Fatalf("frame %q is not an object: %v", data, err)
		}

		if frame["type"] != "resync" {
			return frame
		}
	}
}
