import type { Language } from "@/components/code/multi-language-code";
type Examples=Record<Language,string>;
export const oopExamples:Examples={
cpp:`class Money {
  long cents_;
public:
  explicit Money(long cents) : cents_(cents) {
    if (cents < 0) throw std::invalid_argument("negative money");
  }
  long cents() const { return cents_; }
  Money plus(const Money& other) const { return Money(cents_ + other.cents_); }
};

class CartItem {
  MenuItem item_;
  int quantity_;
public:
  CartItem(MenuItem item, int quantity) : item_(std::move(item)), quantity_(quantity) {
    if (quantity <= 0) throw std::invalid_argument("quantity");
  }
  Money subtotal() const { return Money(item_.price().cents() * quantity_); }
};

class Cart {
  std::vector<CartItem> items_;
public:
  void add(MenuItem item, int quantity) { items_.emplace_back(std::move(item), quantity); }
  Money total() const { Money sum(0); for (const auto& item : items_) sum = sum.plus(item.subtotal()); return sum; }
};`,
go:`type Money struct { cents int64 }

func NewMoney(cents int64) (Money, error) {
  if cents < 0 { return Money{}, errors.New("negative money") }
  return Money{cents: cents}, nil
}
func (m Money) Add(other Money) Money { return Money{cents: m.cents + other.cents} }

type CartItem struct { Item MenuItem; Quantity int }
func NewCartItem(item MenuItem, quantity int) (CartItem, error) {
  if quantity <= 0 { return CartItem{}, errors.New("quantity must be positive") }
  return CartItem{Item: item, Quantity: quantity}, nil
}
func (i CartItem) Subtotal() Money { return Money{cents: i.Item.Price.cents * int64(i.Quantity)} }

type Cart struct { items []CartItem }
func (c *Cart) Add(item MenuItem, quantity int) error {
  line, err := NewCartItem(item, quantity); if err != nil { return err }
  c.items = append(c.items, line); return nil
}
func (c Cart) Total() Money { total := Money{}; for _, line := range c.items { total = total.Add(line.Subtotal()) }; return total }`,
java:`public record Money(long cents) {
  public Money { if (cents < 0) throw new IllegalArgumentException("negative money"); }
  public Money plus(Money other) { return new Money(cents + other.cents); }
}

public final class CartItem {
  private final MenuItem item;
  private final int quantity;
  public CartItem(MenuItem item, int quantity) {
    if (quantity <= 0) throw new IllegalArgumentException("quantity");
    this.item = Objects.requireNonNull(item); this.quantity = quantity;
  }
  public Money subtotal() { return new Money(item.price().cents() * quantity); }
}

public final class Cart {
  private final List<CartItem> items = new ArrayList<>();
  public void add(MenuItem item, int quantity) { items.add(new CartItem(item, quantity)); }
  public Money total() { return items.stream().map(CartItem::subtotal).reduce(new Money(0), Money::plus); }
}`,
typescript:`class Money {
  private constructor(readonly cents: number) {}
  static of(cents: number): Money {
    if (!Number.isInteger(cents) || cents < 0) throw new Error("Invalid money");
    return new Money(cents);
  }
  plus(other: Money) { return Money.of(this.cents + other.cents); }
}

class CartItem {
  constructor(readonly item: MenuItem, readonly quantity: number) {
    if (!Number.isInteger(quantity) || quantity <= 0) throw new Error("Invalid quantity");
  }
  subtotal() { return Money.of(this.item.price.cents * this.quantity); }
}

class Cart {
  #items: CartItem[] = [];
  add(item: MenuItem, quantity: number) { this.#items.push(new CartItem(item, quantity)); }
  total() { return this.#items.map(i => i.subtotal()).reduce((sum, next) => sum.plus(next), Money.of(0)); }
}`};

export const ocpExamples:Examples={
cpp:`// BEFORE: every variant rewrites the same function.
Money price(Money total, CustomerType type) {
  if (type == CustomerType::Regular) return total;
  if (type == CustomerType::Premium) return total.percentOff(10);
  if (type == CustomerType::Employee) return total.percentOff(20);
  throw UnknownCustomerType{};
}

// AFTER: the stable service delegates one observed variation.
class DiscountPolicy {
public:
  virtual ~DiscountPolicy() = default;
  virtual Money apply(Money total) const = 0;
};
class FestivalDiscount final : public DiscountPolicy {
public:
  Money apply(Money total) const override { return total.percentOff(15); }
};
class PricingService {
public:
  Money price(Money total, const DiscountPolicy& policy) const {
    return policy.apply(total);
  }
};
// Templates, function objects, variant, or std::function can also extend behavior.`,
go:`// BEFORE: a growing switch is the change hotspot.
func PriceByType(total Money, customerType string) Money {
  switch customerType {
  case "regular": return total
  case "premium": return total.PercentOff(10)
  case "employee": return total.PercentOff(20)
  default: panic("unknown customer type")
  }
}

// AFTER: an interface or function can express the extension point.
type DiscountPolicy interface { Apply(Money) Money }
type FestivalDiscount struct{}
func (FestivalDiscount) Apply(total Money) Money { return total.PercentOff(15) }

type PricingService struct{}
func (PricingService) Price(total Money, policy DiscountPolicy) Money {
  return policy.Apply(total)
}

// A function is also an honest extension point.
type DiscountFunc func(Money) Money
func (f DiscountFunc) Apply(total Money) Money { return f(total) }`,
java:`// BEFORE: every discount edits this stable service.
Money price(Money total, CustomerType type) {
  if (type == REGULAR) return total;
  if (type == PREMIUM) return total.percentOff(10);
  if (type == EMPLOYEE) return total.percentOff(20);
  throw new IllegalArgumentException("unknown customer type");
}

// AFTER: implementations own independently changing rules.
public interface DiscountPolicy {
  Money apply(Money total);
}
public final class FestivalDiscount implements DiscountPolicy {
  @Override public Money apply(Money total) {
    return total.percentOff(15);
  }
}
public final class PricingService {
  public Money price(Money total, DiscountPolicy policy) {
    return policy.apply(total);
  }
}
// PartnerDiscount adds an implementation; PricingService stays stable.`,
typescript:`// BEFORE: a growing conditional owns every variant.
function priceByType(total: Money, type: CustomerType): Money {
  if (type === "regular") return total;
  if (type === "premium") return total.percentOff(10);
  if (type === "employee") return total.percentOff(20);
  throw new Error("unknown customer type");
}

// AFTER: structural typing keeps the boundary lightweight.
interface DiscountPolicy {
  apply(total: Money): Money;
}
const festivalDiscount: DiscountPolicy = {
  apply: total => total.percentOff(15),
};
type DiscountFn = (total: Money) => Money;

class PricingService {
  price(total: Money, policy: DiscountPolicy) {
    return policy.apply(total);
  }
}
// Structural typing keeps the extension contract lightweight.`};

export const lspExamples:Examples={
cpp:`// VIOLATION: the broad shape forces a dishonest operation.
class Storage {
public:
  virtual Result<Data> load(const Key&) const = 0;
  virtual Result<void> save(const Key&, const Data&) = 0;
};
class ReadOnlyArchive final : public Storage {
  Result<Data> load(const Key& key) const override;
  Result<void> save(const Key&, const Data&) override {
    return Error::unsupported("archive is read-only");
  }
};

// REDESIGN: callers request an honest capability.
class ReadableStorage {
public:
  virtual ~ReadableStorage() = default;
  virtual Result<Data> load(const Key&) const = 0;
};
class WritableStorage {
public:
  virtual ~WritableStorage() = default;
  virtual Result<void> save(const Key&, const Data&) = 0;
};
class S3Storage final : public ReadableStorage, public WritableStorage {
  Result<Data> load(const Key& key) const override;
  Result<void> save(const Key& key, const Data& data) override;
};
// override and const verify shape; contract tests verify behavior and errors.`,
go:`// VIOLATION: compilation cannot detect the silent no-op.
type Storage interface {
  Load(context.Context, string) ([]byte, error)
  Save(context.Context, string, []byte) error
}
type BrokenArchive struct{}
func (BrokenArchive) Load(ctx context.Context, key string) ([]byte, error) { return read(ctx, key) }
func (BrokenArchive) Save(context.Context, string, []byte) error { return nil }

// REDESIGN: Go composes the capabilities the caller actually needs.
type ReadableStorage interface {
  Load(context.Context, string) ([]byte, error)
}
type WritableStorage interface {
  Save(context.Context, string, []byte) error
}
type ReadOnlyArchive struct{ /* ... */ }
func (a *ReadOnlyArchive) Load(ctx context.Context, key string) ([]byte, error) {
  return a.read(ctx, key)
}
// Go has no class inheritance; implicit satisfaction cannot prove behavior.`,
java:`// VIOLATION: the implementation cannot honor the broad contract.
interface Storage {
  byte[] load(String key);
  void save(String key, byte[] data);
}
final class ReadOnlyArchive implements Storage {
  public byte[] load(String key) { return archive.read(key); }
  public void save(String key, byte[] data) {
    throw new UnsupportedOperationException("archive is read-only");
  }
}

// REDESIGN: split the contract by capability.
public interface ReadableStorage {
  byte[] load(String key) throws StorageException;
}
public interface WritableStorage {
  void save(String key, byte[] data) throws StorageException;
}
public final class ReadOnlyArchive implements ReadableStorage {
  @Override public byte[] load(String key) { return archive.read(key); }
}
// Avoid implementing save() only to throw UnsupportedOperationException.
// Every writable implementation runs the same behavioral contract suite.`,
typescript:`// VIOLATION: structural typing checks shape, not the silent lie.
interface Storage {
  load(key: string): Promise<Uint8Array | undefined>;
  save(key: string, data: Uint8Array): Promise<void>;
}
const brokenArchive: Storage = {
  load: key => readArchive(key),
  save: async (_key, _data) => { /* silently ignored */ },
};

// REDESIGN: expose only capabilities the object can preserve.
interface ReadableStorage {
  load(key: string): Promise<Uint8Array | undefined>;
}
interface WritableStorage {
  save(key: string, data: Uint8Array): Promise<void>;
}
const archive: ReadableStorage = {
  load: key => readArchive(key),
};
// Structural typing checks shape, not whether load lies, mutates unrelated
// state, or follows the promised failure semantics.`};

export const encapsulationExamples:Examples={
cpp:`class Order {
  OrderStatus status_{OrderStatus::Draft};
  Money total_;
public:
  explicit Order(Money total) : total_(total) {}
  void confirm() {
    if (status_ != OrderStatus::Draft) throw DomainError("Only drafts can be confirmed");
    if (total_.cents() == 0) throw DomainError("Empty order");
    status_ = OrderStatus::Confirmed;
  }
  void cancel() {
    if (status_ == OrderStatus::Delivered) throw DomainError("Delivered order cannot be cancelled");
    status_ = OrderStatus::Cancelled;
  }
  OrderStatus status() const { return status_; }
};`,
go:`type Order struct { status OrderStatus; total Money }
func NewOrder(total Money) *Order { return &Order{status: Draft, total: total} }
func (o *Order) Confirm() error {
  if o.status != Draft { return errors.New("only drafts can be confirmed") }
  if o.total.Cents() == 0 { return errors.New("empty order") }
  o.status = Confirmed; return nil
}
func (o *Order) Cancel() error {
  if o.status == Delivered { return errors.New("delivered order cannot be cancelled") }
  o.status = Cancelled; return nil
}
func (o Order) Status() OrderStatus { return o.status }`,
java:`public final class Order {
  private OrderStatus status = OrderStatus.DRAFT;
  private final Money total;
  public Order(Money total) { this.total = Objects.requireNonNull(total); }
  public void confirm() {
    if (status != OrderStatus.DRAFT) throw new DomainException("Only drafts can be confirmed");
    if (total.isZero()) throw new DomainException("Empty order");
    status = OrderStatus.CONFIRMED;
  }
  public void cancel() {
    if (status == OrderStatus.DELIVERED) throw new DomainException("Delivered order cannot be cancelled");
    status = OrderStatus.CANCELLED;
  }
  public OrderStatus status() { return status; }
}`,
typescript:`class Order {
  #status: OrderStatus = "DRAFT";
  constructor(readonly total: Money) {}
  confirm() {
    if (this.#status !== "DRAFT") throw new DomainError("Only drafts can be confirmed");
    if (this.total.cents === 0) throw new DomainError("Empty order");
    this.#status = "CONFIRMED";
  }
  cancel() {
    if (this.#status === "DELIVERED") throw new DomainError("Delivered order cannot be cancelled");
    this.#status = "CANCELLED";
  }
  get status(): OrderStatus { return this.#status; }
}`};

export const polymorphismExamples:Examples={
cpp:`class PaymentMethod {
public:
  virtual ~PaymentMethod() = default;
  virtual PaymentResult pay(const Order& order) = 0;
};
class CardPayment final : public PaymentMethod {
  CardGateway& gateway_;
public:
  explicit CardPayment(CardGateway& gateway) : gateway_(gateway) {}
  PaymentResult pay(const Order& order) override { return gateway_.charge(order.id(), order.total()); }
};
class CheckoutService {
public:
  PaymentResult checkout(const Order& order, PaymentMethod& method) { return method.pay(order); }
};`,
go:`type PaymentMethod interface { Pay(context.Context, Order) (PaymentResult, error) }
type CardPayment struct { gateway CardGateway }
func (p CardPayment) Pay(ctx context.Context, order Order) (PaymentResult, error) {
  return p.gateway.Charge(ctx, order.ID(), order.Total())
}
type CheckoutService struct{}
func (CheckoutService) Checkout(ctx context.Context, order Order, method PaymentMethod) (PaymentResult, error) {
  return method.Pay(ctx, order)
}
// CardPayment satisfies PaymentMethod implicitly; there is no class inheritance.`,
java:`public interface PaymentMethod { PaymentResult pay(Order order); }
public final class CardPayment implements PaymentMethod {
  private final CardGateway gateway;
  public CardPayment(CardGateway gateway) { this.gateway = gateway; }
  @Override public PaymentResult pay(Order order) {
    return gateway.charge(order.id(), order.total());
  }
}
public final class CheckoutService {
  public PaymentResult checkout(Order order, PaymentMethod method) { return method.pay(order); }
}`,
typescript:`interface PaymentMethod { pay(order: Order): Promise<PaymentResult>; }
class CardPayment implements PaymentMethod {
  constructor(private readonly gateway: CardGateway) {}
  pay(order: Order) { return this.gateway.charge(order.id, order.total); }
}
class CheckoutService {
  checkout(order: Order, method: PaymentMethod) { return method.pay(order); }
}
// Any value with a compatible pay method satisfies this structural contract.`};

export const lifecycleExamples:Examples={
cpp:`class PaymentSession {
  enum class State { Ready, Processing, Succeeded, Failed, Closed };
  State state_{State::Ready};
  PaymentGateway& gateway_; // borrowed; gateway outlives this operation
public:
  explicit PaymentSession(PaymentGateway& gateway) : gateway_(gateway) {}
  PaymentResult process(const Order& order) {
    if (state_ != State::Ready) throw DomainError("session is not ready");
    state_ = State::Processing;
    auto result = gateway_.charge(order.total());
    state_ = result.ok() ? State::Succeeded : State::Failed;
    return result;
  }
  void close() noexcept { state_ = State::Closed; }
};

void checkout(PaymentGateway& gateway, const Order& order) {
  PaymentSession session(gateway); // stack lifetime; single scope owns it
  session.process(order);
  session.close();
} // destructor runs here; RAII resources owned by session are released`,
go:`type PaymentSession struct {
  state State
  client PaymentClient // referenced dependency
  cancel context.CancelFunc
}

func NewPaymentSession(parent context.Context, client PaymentClient) *PaymentSession {
  _, cancel := context.WithCancel(parent)
  return &PaymentSession{state: Ready, client: client, cancel: cancel}
}
func (s *PaymentSession) Process(ctx context.Context, order Order) (PaymentResult, error) {
  if s.state != Ready { return PaymentResult{}, errors.New("session is not ready") }
  s.state = Processing
  result, err := s.client.Charge(ctx, order.Total())
  if err != nil { s.state = Failed; return PaymentResult{}, err }
  s.state = Succeeded; return result, nil
}
func (s *PaymentSession) Close() { s.cancel(); s.state = Closed }

session := NewPaymentSession(ctx, client)
defer session.Close() // operation owns cancellation and cleanup`,
java:`public final class PaymentSession implements AutoCloseable {
  private State state = State.READY;
  private final PaymentClient client; // referenced, not created here

  public PaymentSession(PaymentClient client) { this.client = client; }
  public PaymentResult process(Order order) {
    if (state != State.READY) throw new IllegalStateException("session is not ready");
    state = State.PROCESSING;
    try {
      var result = client.charge(order.total());
      state = State.SUCCEEDED; return result;
    } catch (RuntimeException failure) {
      state = State.FAILED; throw failure;
    }
  }
  @Override public void close() { state = State.CLOSED; }
}

try (var session = new PaymentSession(paymentClient)) {
  return session.process(order);
} // deterministic cleanup; garbage collection is not the resource policy`,
typescript:`class PaymentSession {
  #state: State = "READY";
  #abort = new AbortController();
  constructor(private readonly client: PaymentClient) {}

  async process(order: Order): Promise<PaymentResult> {
    if (this.#state !== "READY") throw new Error("session is not ready");
    this.#state = "PROCESSING";
    try {
      const result = await this.client.charge(order.total, this.#abort.signal);
      this.#state = "SUCCEEDED"; return result;
    } catch (failure) {
      this.#state = "FAILED"; throw failure;
    }
  }
  close() { this.#abort.abort(); this.#state = "CLOSED"; }
}

const session = new PaymentSession(paymentClient);
try { await session.process(order); }
finally { session.close(); } // stop work and detach logical resources`};

export const srpExamples:Examples={
cpp:`// BEFORE: policy, I/O, and orchestration change together.
class OrderService {
public:
  Receipt place(const Draft& draft) {
    validate(draft); auto total = calculateTaxAndDiscount(draft);
    inventory_.reserve(draft.items()); gateway_.charge(total);
    repository_.save(draft, total); email_.send(draft.customer());
    analytics_.track("order_placed"); return invoice_.generate(draft, total);
  }
};

// AFTER: Checkout owns the workflow; collaborators own volatile policies.
class CheckoutService {
  OrderValidator& validator_; PricingPolicy& pricing_;
  InventoryService& inventory_; PaymentProcessor& payments_;
  OrderRepository& orders_; NotificationService& notifications_;
public:
  Receipt place(const Draft& draft) {
    validator_.validate(draft);
    auto priced = pricing_.price(draft);
    auto reservation = inventory_.reserve(priced.items());
    auto payment = payments_.charge(priced.total());
    auto order = orders_.save(Order::confirmed(priced, reservation, payment));
    notifications_.orderConfirmed(order);
    return Receipt::from(order);
  }
}; // runtime interfaces are useful at genuine boundaries; value policies can be static`,
go:`// BEFORE: one type imports every reason to change.
type OrderService struct { db *sql.DB; payments *Stripe; mail *SMTP; stock *Warehouse }
func (s *OrderService) Place(ctx context.Context, draft Draft) (Receipt, error) {
  // validate, calculate tax, reserve, charge, save, email, analytics, invoice...
}

// AFTER: small interfaces are defined where Checkout consumes them.
type PaymentProcessor interface { Charge(context.Context, Money) (Payment, error) }
type OrderStore interface { Save(context.Context, Order) error }
type Checkout struct { price PricingPolicy; pay PaymentProcessor; store OrderStore; stock Inventory }
func (c Checkout) Place(ctx context.Context, draft Draft) (Receipt, error) {
  if err := ValidateDraft(draft); err != nil { return Receipt{}, err }
  priced := c.price.Price(draft)
  reservation, err := c.stock.Reserve(ctx, priced.Items); if err != nil { return Receipt{}, err }
  payment, err := c.pay.Charge(ctx, priced.Total); if err != nil { return Receipt{}, err }
  order := ConfirmOrder(priced, reservation, payment)
  if err := c.store.Save(ctx, order); err != nil { return Receipt{}, err }
  return NewReceipt(order), nil
}`,
java:`// BEFORE: six teams edit this class.
final class OrderService {
  Receipt place(Draft draft) {
    validate(draft); var priced = calculateTaxAndDiscount(draft);
    inventory.reserve(priced.items()); stripe.charge(priced.total());
    database.save(priced); smtp.sendConfirmation(priced);
    analytics.track(priced); return pdfInvoice.generate(priced);
  }
}

// AFTER: interfaces mark boundaries with real substitution value.
final class CheckoutService {
  private final OrderValidator validator;
  private final PricingPolicy pricing;
  private final InventoryService inventory;
  private final PaymentProcessor payments;
  private final OrderRepository orders;
  CheckoutService(OrderValidator v, PricingPolicy p, InventoryService i,
                  PaymentProcessor pay, OrderRepository orders) {
    this.validator=v; this.pricing=p; this.inventory=i; this.payments=pay; this.orders=orders;
  }
  Receipt place(Draft draft) {
    validator.validate(draft); var priced=pricing.price(draft);
    var reservation=inventory.reserve(priced.items());
    var payment=payments.charge(priced.total());
    var order=orders.save(Order.confirmed(priced,reservation,payment));
    return Receipt.from(order);
  }
}`,
typescript:`// BEFORE: unrelated provider and policy changes collide here.
class OrderService {
  async place(draft: Draft) {
    validate(draft); const total = calculateTaxAndDiscount(draft);
    await inventory.reserve(draft.items); await stripe.charge(total);
    await database.save(draft, total); await email.send(draft.customerId);
    analytics.track("order_placed"); return pdfInvoice.generate(draft, total);
  }
}

// AFTER: structural contracts keep the orchestration boundary lightweight.
interface PaymentProcessor { charge(total: Money): Promise<Payment>; }
interface OrderRepository { save(order: Order): Promise<Order>; }
class CheckoutService {
  constructor(private validator: OrderValidator, private pricing: PricingPolicy,
    private inventory: InventoryService, private payments: PaymentProcessor,
    private orders: OrderRepository) {}
  async place(draft: Draft) {
    this.validator.validate(draft); const priced=this.pricing.price(draft);
    const reservation=await this.inventory.reserve(priced.items);
    const payment=await this.payments.charge(priced.total);
    const order=Order.confirmed(priced,reservation,payment);
    return Receipt.from(await this.orders.save(order));
  }
}`};

export const ispDipExamples:Examples={
cpp:`struct OrderStore { virtual ~OrderStore()=default; virtual void save(const Order&)=0; };
struct PaymentProcessor { virtual ~PaymentProcessor()=default; virtual Payment charge(Money)=0; };
class CheckoutService {
  OrderStore& orders_; PaymentProcessor& payments_;
public:
  CheckoutService(OrderStore& o, PaymentProcessor& p):orders_(o),payments_(p){}
  Receipt checkout(const Draft& d){ auto order=Order::confirm(d,payments_.charge(d.total())); orders_.save(order); return Receipt{order}; }
}; // references are injected; application policy does not include a Stripe header`,
go:`type OrderStore interface { Save(context.Context, Order) error }
type PaymentProcessor interface { Charge(context.Context, Money) (Payment, error) }
type Checkout struct { orders OrderStore; payments PaymentProcessor }
func NewCheckout(o OrderStore, p PaymentProcessor) Checkout { return Checkout{o,p} }
// Interfaces live beside the consuming use case; StripeAdapter satisfies them implicitly.`,
java:`interface OrderStore { void save(Order order); }
interface PaymentProcessor { Payment charge(Money total); }
final class CheckoutService {
  private final OrderStore orders; private final PaymentProcessor payments;
  CheckoutService(OrderStore o, PaymentProcessor p){ orders=o; payments=p; }
  Receipt checkout(Draft d){ var order=Order.confirm(d,payments.charge(d.total())); orders.save(order); return Receipt.from(order); }
} // constructor injection makes dependencies visible and the object valid`,
typescript:`interface OrderStore { save(order: Order): Promise<void>; }
interface PaymentProcessor { charge(total: Money): Promise<Payment>; }
class CheckoutService {
  constructor(private orders: OrderStore, private payments: PaymentProcessor) {}
  async checkout(draft: Draft) { const payment=await this.payments.charge(draft.total); const order=Order.confirm(draft,payment); await this.orders.save(order); return Receipt.from(order); }
} // structural ports describe only what this consumer needs`};

export const couplingExamples:Examples={
cpp:`class RideService {
  FarePolicy& fares_; DriverFinder& drivers_; TripStore& trips_;
public:
  Trip request(const RideRequest& r){ auto quote=fares_.quote(r.route()); auto driver=drivers_.nearest(r.pickup()); return trips_.create(r,quote,driver); }
}; // cohesive orchestration; policy, search, and persistence change independently`,
go:`type RideService struct { fares FarePolicy; drivers DriverFinder; trips TripStore }
func (s RideService) Request(ctx context.Context, r RideRequest) (Trip,error) {
 q:=s.fares.Quote(r.Route); d,err:=s.drivers.Nearest(ctx,r.Pickup); if err!=nil{return Trip{},err}; return s.trips.Create(ctx,r,q,d)
} // pass a request value, not twelve temporally ordered setters`,
java:`final class RideService {
  private final FarePolicy fares; private final DriverFinder drivers; private final TripRepository trips;
  Trip request(RideRequest r){ var quote=fares.quote(r.route()); var driver=drivers.nearest(r.pickup()); return trips.create(r,quote,driver); }
} // the use case coordinates; collaborators retain cohesive vocabularies`,
typescript:`class RideService {
  constructor(private fares: FarePolicy, private drivers: DriverFinder, private trips: TripStore) {}
  async request(input: RideRequest): Promise<Trip> { const [quote,driver]=await Promise.all([this.fares.quote(input.route),this.drivers.nearest(input.pickup)]); return this.trips.create(input,quote,driver); }
} // explicit data coupling is preferable to hidden global or temporal coupling`};

export const compositionExamples:Examples={
cpp:`class Vehicle { std::unique_ptr<Movement> movement_; std::unique_ptr<Armor> armor_;
public: Vehicle(std::unique_ptr<Movement> m,std::unique_ptr<Armor> a):movement_(std::move(m)),armor_(std::move(a)){} void travel(){movement_->move();} };
// Ownership is explicit; capabilities vary without multiplying subclasses.`,
go:`type Movement interface { Move() error }
type Vehicle struct { Movement Movement; Armor Armor }
func (v Vehicle) Travel() error { return v.Movement.Move() }
// Embedding can promote methods, but named fields make delegation and ownership clearer.`,
java:`final class Vehicle {
  private final Movement movement; private final Armor armor;
  Vehicle(Movement m, Armor a){ movement=m; armor=a; }
  void travel(){ movement.move(); }
} // delegate replaceable behavior; do not inherit only to reuse lines`,
typescript:`class Vehicle {
  constructor(private movement: Movement, private armor: Armor) {}
  travel(){ return this.movement.move(); }
}
// Structural capabilities can be plain objects; composition keeps axes independent.`};

export const apiDesignExamples:Examples={
cpp:`struct ReservationRequest { static expected<ReservationRequest,ValidationError> create(SeatId, TimeRange); };
expected<Reservation,ReserveError> reserve(const ReservationRequest& request);
// A request value validates cross-field rules; errors preserve the reason.`,
go:`type ReservationRequest struct { Seat SeatID; Window TimeRange }
func NewReservationRequest(seat SeatID, window TimeRange) (ReservationRequest,error) { if !window.Valid(){return ReservationRequest{},ErrInvalidWindow}; return ReservationRequest{seat,window},nil }
func (s *Service) Reserve(ctx context.Context, req ReservationRequest) (Reservation,error)`,
java:`public record ReservationRequest(SeatId seat, TimeRange window) {
  public ReservationRequest { Objects.requireNonNull(seat); if(!window.isValid()) throw new IllegalArgumentException("window"); }
}
sealed interface ReserveResult permits Reserved, SeatConflict, WindowExpired {}
ReserveResult reserve(ReservationRequest request);`,
typescript:`type ReservationRequest = Readonly<{seatId: SeatId; window: TimeRange}>;
type ReserveResult = {ok:true; reservation:Reservation}|{ok:false; reason:"SEAT_CONFLICT"|"WINDOW_EXPIRED"};
function createRequest(input: unknown): ReservationRequest { return reservationSchema.parse(input); }
async function reserve(request: ReservationRequest): Promise<ReserveResult> { /* command with explicit outcome */ }`};

export const cleanCodeExamples:Examples={
cpp:`Receipt checkout(const Order& order, const Customer& customer) {
  if (!customer.active()) throw InactiveCustomer{};
  if (!order.is_valid()) throw InvalidOrder{};
  const Money total = pricing_.price(order); // const communicates no reassignment
  Payment payment = payments_.charge(total);
  return orders_.confirm(order, payment); // RAII cleans acquired resources on failure
}`,
go:`func (s Service) Checkout(ctx context.Context, order Order, customer Customer) (Receipt, error) {
 if !customer.Active { return Receipt{}, ErrInactiveCustomer }
 if err := order.Validate(); err != nil { return Receipt{}, fmt.Errorf("validate order: %w", err) }
 total := s.pricing.Price(order) // short local names are clear when scope is small
 payment, err := s.payments.Charge(ctx, total); if err != nil { return Receipt{}, fmt.Errorf("charge payment: %w", err) }
 return s.orders.Confirm(ctx, order, payment)
}`,
java:`Receipt checkout(Order order, Customer customer) {
  if (!customer.isActive()) throw new InactiveCustomer();
  order.validate();
  var total = pricing.price(order);
  var payment = payments.charge(total);
  return orders.confirm(order, payment);
} // a cohesive 30-line workflow may be clearer than five one-line wrappers`,
typescript:`async function checkout({order, customer}: CheckoutRequest): Promise<Receipt> {
  if (!customer.isActive) throw new InactiveCustomer();
  order.validate();
  const total = pricing.price(order);
  const payment = await payments.charge(total);
  return orders.confirm(order, payment);
} // readonly request values and unions clarify intent; clever types can still obscure it`};

export const advancedCleanCodeExamples:Examples={
cpp:`struct Money { std::int64_t minor_units; Currency currency; };
class Checkout {
  Pricing& pricing_; PaymentPort& payments_; OrderStore& orders_;
public: Receipt place(const PlaceOrder& command); // no SQLRow crosses the port
};`,
go:`type Money struct { MinorUnits int64; Currency Currency }
type PlaceOrder struct { CustomerID CustomerID; Items []LineItem }
type Checkout struct { pricing Pricing; payments PaymentPort; orders OrderStore }
// Purpose-built values replace primitive clots without a giant context object.`,
java:`record Money(long minorUnits, Currency currency) {}
record PlaceOrder(CustomerId customerId, List<LineItem> items) {}
final class Checkout {
  private final Pricing pricing; private final PaymentPort payments; private final OrderRepository orders;
  Receipt place(PlaceOrder command) { /* orchestration over domain types, not SQL rows */ }
}`,
typescript:`type Money = Readonly<{minorUnits:number; currency:Currency}>;
type PlaceOrder = Readonly<{customerId:CustomerId; items:readonly LineItem[]}>;
class Checkout {
  constructor(private pricing:Pricing, private payments:PaymentPort, private orders:OrderStore) {}
  place(command:PlaceOrder):Promise<Receipt> { /* explicit ownership and ports */ }
}`};

export const errorHandlingExamples:Examples={
cpp:`std::expected<Receipt, CheckoutError> checkout(const Request& r) {
  if (auto valid=validate(r); !valid) return std::unexpected(valid.error());
  try { return persist(pay(reserve(r))); }
  catch (const ProviderTimeout& e) { return std::unexpected(ProviderUnavailable{e.what()}); }
} // RAII releases reservations during stack unwinding; bugs are not normal results`,
go:`func Checkout(ctx context.Context, r Request) (Receipt, error) {
 if err:=Validate(r); err!=nil { return Receipt{}, fmt.Errorf("validate checkout: %w",err) }
 reservation,err:=inventory.Reserve(ctx,r.Items); if err!=nil { return Receipt{}, fmt.Errorf("reserve inventory: %w",err) }
 payment,err:=payments.Charge(ctx,r.Total); if err!=nil { return Receipt{}, fmt.Errorf("charge payment: %w",err) }
 return orders.Save(ctx,reservation,payment)
} // callers use errors.Is/As; context cancellation remains inspectable`,
java:`CheckoutResult checkout(Request request) {
  var validation = validate(request); if (validation.isInvalid()) return validation;
  try { return new Completed(orders.save(payments.charge(inventory.reserve(request)))); }
  catch (PaymentDeclined expected) { return new Declined(expected.reason()); }
  catch (ProviderTimeout failure) { throw new CheckoutUnavailable("payment provider timed out", failure); }
} // expected outcomes may be values; unexpected failures preserve causes`,
typescript:`type CheckoutResult = {ok:true;receipt:Receipt}|{ok:false;error:"INVALID"|"DECLINED"|"UNAVAILABLE"};
async function checkout(request:Request):Promise<CheckoutResult>{
 const invalid=validate(request); if(invalid)return {ok:false,error:"INVALID"};
 try { return {ok:true,receipt:await complete(request)}; }
 catch(error){ if(error instanceof PaymentDeclined)return {ok:false,error:"DECLINED"}; throw new CheckoutUnavailable("checkout failed",{cause:error}); }
}`};

export const observabilityExamples:Examples={
cpp:`struct ScopeTimer { Logger& log; std::string span; TimePoint start{now()};
  ~ScopeTimer(){ log.info("span.completed", {{"span",span},{"duration_ms",elapsed(start)}}); }
};
Receipt checkout(const Request& r, const TraceContext& trace) {
  ScopeTimer timer{log_, "checkout"};
  log_.info("checkout.started", {{"order_id",r.order_id},{"trace_id",trace.id}});
  return payments_.capture(r); // never log card data or access tokens
}`,
go:`func (s Service) Checkout(ctx context.Context, r Request) (Receipt, error) {
 traceID := TraceIDFrom(ctx); started := time.Now()
 s.log.InfoContext(ctx, "checkout.started", "order_id", r.OrderID, "trace_id", traceID)
 receipt, err := s.payments.Capture(ctx, r.Payment)
 if err != nil { s.log.ErrorContext(ctx, "payment.capture.failed", "order_id",r.OrderID,"duration_ms",time.Since(started).Milliseconds(),"err",err); return Receipt{},err }
 return receipt,nil
}`,
java:`Receipt checkout(Request request) {
  try (var ignored = MDC.putCloseable("trace_id", request.traceId())) {
    log.info("checkout.started order_id={}", request.orderId());
    var started = clock.instant();
    try { return payments.capture(request.payment()); }
    catch (ProviderTimeout cause) {
      log.error("payment.capture.failed order_id={} duration_ms={}", request.orderId(), elapsed(started), cause); throw cause;
    }
  }
}`,
typescript:`const requestContext = new AsyncLocalStorage<{traceId:string}>();
async function checkout(request: Request): Promise<Receipt> {
  const started = performance.now();
  logger.info({event:"checkout.started", orderId:request.orderId, traceId:requestContext.getStore()?.traceId});
  try { return await payments.capture(request.payment); }
  catch (error) { logger.error({event:"payment.capture.failed", orderId:request.orderId, durationMs:performance.now()-started, errorCode:classify(error)}); throw error; }
}`};

export const testingExamples:Examples={
cpp:`TEST_CASE("premium discount rule matrix") {
  const std::vector cases{{1000, Member::Premium, 900},{5000, Member::Guest,5000}};
  for (const auto& [subtotal,member,expected] : cases)
    REQUIRE(DiscountEngine{}.total(subtotal,member) == expected);
}
TEST_CASE("expired coupon uses deterministic clock") {
  FakeClock clock{"2026-10-03T00:01:00Z"}; REQUIRE_FALSE(Coupon{midnight}.valid(clock));
}`,
go:`func TestDiscount(t *testing.T) {
 tests:=[]struct{name string; subtotal int; premium bool; want int}{
  {"premium",1000,true,900},{"boundary",0,true,0},{"guest",5000,false,5000},
 }
 for _,tt:=range tests { t.Run(tt.name,func(t *testing.T){ if got:=Total(tt.subtotal,tt.premium); got!=tt.want { t.Fatalf("got %d want %d",got,tt.want) } }) }
}
// A small fake repository verifies state; an injected Clock controls expiry.`,
java:`@ParameterizedTest
@CsvSource({"1000, PREMIUM, 900", "0, PREMIUM, 0", "5000, GUEST, 5000"})
void calculatesDiscount(long subtotal, Member member, long expected) {
  assertEquals(expected, new DiscountEngine().total(subtotal, member));
}
@Test void rejectsExpiredCoupon() {
  var clock = Clock.fixed(Instant.parse("2026-10-03T00:01:00Z"), ZoneOffset.UTC);
  assertFalse(coupon.isValid(clock));
}`,
typescript:`test.each([
  {subtotal:1000, member:"premium", expected:900},
  {subtotal:0, member:"premium", expected:0},
  {subtotal:5000, member:"guest", expected:5000},
])("$member at $subtotal → $expected", ({subtotal,member,expected}) => {
  expect(new DiscountEngine().total(subtotal,member)).toBe(expected);
});
// Assert behavior; do not freeze private helper call order.`};

export const strategyExamples:Examples={
cpp:`struct PricingStrategy { virtual ~PricingStrategy()=default; virtual Money price(const Ride&) const=0; };
struct SurgePricing final: PricingStrategy { double multiplier; Money price(const Ride& r) const override { return r.base()*multiplier; } };
class RidePricing { const PricingStrategy& strategy_; public: RidePricing(const PricingStrategy& s):strategy_(s){} Money quote(const Ride& r)const{return strategy_.price(r);} };
// A template or callable is a compile-time alternative when runtime replacement is unnecessary.`,
go:`type PricingStrategy interface { Price(Ride) Money }
type PricingFunc func(Ride) Money
func (f PricingFunc) Price(r Ride) Money { return f(r) }
type RidePricing struct { strategy PricingStrategy }
func (p RidePricing) Quote(r Ride) Money { return p.strategy.Price(r) }
var standard PricingFunc = func(r Ride) Money { return r.Base }
// Composition selects the function; the context contains no ride-type branch.`,
java:`interface PricingStrategy { Money price(Ride ride); }
record SurgePricing(BigDecimal multiplier) implements PricingStrategy {
  public Money price(Ride ride) { return ride.base().multiply(multiplier); }
}
final class RidePricing {
  private final PricingStrategy strategy;
  RidePricing(PricingStrategy strategy) { this.strategy=strategy; }
  Money quote(Ride ride) { return strategy.price(ride); }
}
PricingStrategy standard = ride -> ride.base();`,
typescript:`type PricingStrategy = (ride: Ride) => Money;
const surge = (multiplier:number):PricingStrategy => ride => ride.base.multiply(multiplier);
class RidePricing {
  constructor(private readonly strategy:PricingStrategy) {}
  quote(ride:Ride):Money { return this.strategy(ride); }
}
const registry:Record<RideType,PricingStrategy> = {standard:r=>r.base,surge:surge(1.8),corporate:corporatePrice};
// Structural typing makes a named strategy object optional for simple behavior.`};

export const factoryExamples:Examples={
cpp:`std::unique_ptr<PricingStrategy> make_pricing(RideType type, Dependencies& d) {
  switch(type) {
    case RideType::Standard: return std::make_unique<StandardPricing>();
    case RideType::Surge: return std::make_unique<SurgePricing>(d.surge, d.clock, d.region);
    case RideType::Corporate: return std::make_unique<CorporatePricing>(d.contracts, d.tax);
  }
  throw UnknownRideType{};
} // unique_ptr transfers one clear owner; templates can avoid runtime selection when the type is known`,
go:`type Creator func(Dependencies) (PricingStrategy, error)
var creators = map[RideType]Creator{
 Standard: func(Dependencies) (PricingStrategy,error) { return StandardPricing{},nil },
 Surge: func(d Dependencies) (PricingStrategy,error) { return NewSurgePricing(d.Surge,d.Clock,d.Region) },
}
func NewPricingStrategy(kind RideType, d Dependencies) (PricingStrategy,error) {
 create,ok:=creators[kind]; if !ok{return nil,fmt.Errorf("unknown ride type %q",kind)}; return create(d)
}`,
java:`final class PaymentProcessorFactory {
  PaymentProcessor create(Merchant merchant) {
    return switch (merchant.provider()) {
      case STRIPE -> new StripeProcessor(keys.forMerchant(merchant.id()), clock);
      case ADYEN -> new AdyenProcessor(config.adyen(), fraudRules);
    };
  }
}
abstract class DocumentImporter { final Document run(File f){return createParser().parse(f);} abstract Parser createParser(); }`,
typescript:`type Creator = (deps:Dependencies) => PricingStrategy;
const creators = new Map<RideType,Creator>([
  ["standard", () => standardPricing],
  ["surge", d => createSurgePricing(d.surge,d.clock,d.region)],
]);
export function createPricingStrategy(type:RideType,deps:Dependencies):PricingStrategy {
  const create=creators.get(type); if(!create) throw new UnknownRideType(type); return create(deps);
} // a factory can be a function; registration is justified only by real plugin pressure`};

export const builderExamples:Examples={
cpp:`class NotificationBuilder {
  Recipient recipient_; std::string body_; Priority priority_{Priority::Normal}; std::vector<File> attachments_;
public:
  NotificationBuilder& recipient(Recipient r){recipient_=std::move(r);return *this;}
  NotificationBuilder& body(std::string b){body_=std::move(b);return *this;}
  Notification build() && { validate(recipient_,body_); return Notification{std::move(recipient_),std::move(body_),priority_,std::move(attachments_)}; }
}; // return a value; move resources; avoid unnecessary heap ownership`,
go:`type ServerOption func(*Server) error
func WithTimeout(d time.Duration) ServerOption { return func(s *Server) error { if d<=0{return errors.New("timeout")}; s.timeout=d; return nil } }
func WithLogger(log *slog.Logger) ServerOption { return func(s *Server) error { s.log=log; return nil } }
func NewServer(addr string, options ...ServerOption) (*Server,error) {
 s:=&Server{addr:addr,timeout:5*time.Second,log:slog.Default()}; for _,apply:=range options {if err:=apply(s);err!=nil{return nil,err}}; return s,nil
} // functional options often fit Go better than a fluent Builder type`,
java:`public final class Notification {
  private final Recipient recipient; private final String body; private final List<Attachment> attachments;
  private Notification(Builder b){recipient=b.recipient;body=b.body;attachments=List.copyOf(b.attachments);}
  static final class Builder {
    private Recipient recipient; private String body; private final List<Attachment> attachments=new ArrayList<>();
    Builder recipient(Recipient r){recipient=r;return this;} Builder body(String v){body=v;return this;}
    Notification build(){Objects.requireNonNull(recipient);if(body==null||body.isBlank())throw new IllegalStateException("body");return new Notification(this);}
  }
}`,
typescript:`type NotificationOptions = {recipient:Recipient;body:string;priority?:Priority;trackingEnabled?:boolean};
function createNotification(options:NotificationOptions):Notification {
  if(!options.body.trim()) throw new Error("body is required");
  return Object.freeze({...options,priority:options.priority ?? "normal",trackingEnabled:options.trackingEnabled ?? false});
}
// Named object parameters beat a classical Builder here. Use a builder only for real stepwise state or a complex fluent API.`};

export const singletonExamples:Examples={
cpp:`class MetricsRegistry {
public: static MetricsRegistry& instance() { static MetricsRegistry value; return value; } // thread-safe initialization since C++11
private: MetricsRegistry()=default;
};
// Prefer: Application owns MetricsRegistry metrics; services receive Metrics& explicitly.
// One owner preserves lifetime without making every dependency global.`,
go:`// Package initialization can create one process-wide value, but callers then hide a dependency.
var defaultMetrics = NewMetricsRegistry()

type PaymentService struct { metrics Metrics; repo PaymentRepository }
func NewPaymentService(m Metrics, r PaymentRepository) PaymentService { return PaymentService{m,r} }
// sync.Once safely initializes lazily; it does not make mutable state or its API safe.`,
java:`public enum ProcessMetrics { INSTANCE; /* JVM-safe singleton identity */ }

final class PaymentApplication {
  private final Metrics metrics = new MetricsRegistry();
  PaymentService payments(PaymentRepository repo) { return new PaymentService(repo, metrics); }
}
// DI singleton scope means one container-owned instance; it does not require global getInstance().`,
typescript:`// ES modules are cached per module graph/runtime—not universally across workers, tests, realms, or serverless instances.
const metrics = new MetricsRegistry();
export function createPaymentApplication(config:Config) {
  const repository=createRepository(config.database);
  return new PaymentService(repository,metrics); // explicit composition is still visible here
}
// exporting a mutable object globally makes test isolation and multi-instance evolution harder.`};

export const observerExamples:Examples={
cpp:`class Subscription { Subject* source_; Token token_; public: ~Subscription(){ if(source_) source_->unsubscribe(token_); } };
using OrderListener = std::function<void(const OrderConfirmed&)>;
// Subject stores non-owning callbacks and returns an RAII token; copy listeners before notify if callbacks may unsubscribe.
auto subscription = orders.subscribe([&email](const OrderConfirmed& e){ email.send(e.order_id); });`,
go:`type OrderObserver func(OrderConfirmed) error
type OrderEvents struct { observers []OrderObserver }
func (e *OrderEvents) Subscribe(fn OrderObserver) (unsubscribe func()) { /* add token; remove by token */ return func(){/* remove */} }
func (e *OrderEvents) Emit(event OrderConfirmed) []error { var errs []error; for _,fn:=range e.observers {if err:=fn(event);err!=nil{errs=append(errs,err)}}; return errs }
// A channel changes delivery, blocking, ownership, and failure semantics; it is not just different syntax.`,
java:`interface OrderObserver { void onOrderConfirmed(OrderConfirmed event); }
final class OrderEvents {
  private final List<OrderObserver> observers = new ArrayList<>();
  AutoCloseable subscribe(OrderObserver o){observers.add(o);return () -> observers.remove(o);}
  List<RuntimeException> emit(OrderConfirmed e){var failures=new ArrayList<RuntimeException>(); for(var o:List.copyOf(observers))try{o.onOrderConfirmed(e);}catch(RuntimeException x){failures.add(x);} return failures;}
}`,
typescript:`type Listener<T> = (event:Readonly<T>) => void | Promise<void>;
class EventSource<T> {
  private listeners=new Set<Listener<T>>();
  subscribe(listener:Listener<T>){this.listeners.add(listener);return ()=>this.listeners.delete(listener);}
  emitSync(event:Readonly<T>){for(const listener of [...this.listeners]) listener(event);}
}
const unsubscribe=orders.subscribe(event=>email.send(event.orderId));
// addEventListener/removeEventListener express the same lifecycle shape in the browser.`};

export const decoratorExamples:Examples={
cpp:`struct HttpClient { virtual ~HttpClient()=default; virtual Response send(const Request&)=0; };
class RetryClient final: public HttpClient {
  std::unique_ptr<HttpClient> inner_; int attempts_;
public: RetryClient(std::unique_ptr<HttpClient> inner,int n):inner_(std::move(inner)),attempts_(n){}
  Response send(const Request& r) override { for(int n=1;;++n)try{return inner_->send(r);}catch(const Transient&){if(n==attempts_)throw;} }
};
// unique_ptr forms an ownership chain; wrapper order defines semantics.`,
go:`type RoundTripper interface { RoundTrip(Request) (Response,error) }
type RoundTripFunc func(Request) (Response,error)
func (f RoundTripFunc) RoundTrip(r Request)(Response,error){return f(r)}
func WithMetrics(next RoundTripper, metrics Metrics) RoundTripper {
 return RoundTripFunc(func(r Request)(Response,error){start:=time.Now();resp,err:=next.RoundTrip(r);metrics.Observe(time.Since(start),err);return resp,err})
}
// Higher-order middleware often expresses Decorator more naturally than wrapper classes.`,
java:`interface HttpClient { Response send(Request request); }
final class LoggingClient implements HttpClient {
  private final HttpClient inner; private final Logger log;
  LoggingClient(HttpClient inner,Logger log){this.inner=inner;this.log=log;}
  public Response send(Request request){log.info("http.started");try{return inner.send(request);}finally{log.info("http.completed");}}
}
HttpClient client=new MetricsClient(new RetryClient(new LoggingClient(real,log),3),metrics);`,
typescript:`type HttpClient={send(request:Request):Promise<Response>};
const withRetry=(inner:HttpClient,attempts:number):HttpClient=>({async send(request){for(let n=1;;n++)try{return await inner.send(request)}catch(error){if(n===attempts)throw error}}});
const withMetrics=(inner:HttpClient,metrics:Metrics):HttpClient=>({async send(request){const start=performance.now();try{return await inner.send(request)}finally{metrics.observe(performance.now()-start)}}});
const client=withMetrics(withRetry(realClient,3),metrics);`};

export const adapterFacadeExamples:Examples={
cpp:`class StripeAdapter final: public PaymentProcessor {
  LegacyStripeSdk& sdk_; public: explicit StripeAdapter(LegacyStripeSdk& sdk):sdk_(sdk){}
  PaymentResult charge(const PaymentRequest& r) override {
    try { auto raw=sdk_.makeCharge(r.total().minor_units(),r.token().value(),r.total().currency()); return translate(raw); }
    catch(const StripeDeclined& e){ throw PaymentDeclined{safe_reason(e)}; }
  }
}; // non-owning reference: SDK lifetime must outlive adapter`,
go:`// Consumer package owns the small contract.
type PaymentProcessor interface { Charge(context.Context,PaymentRequest)(PaymentResult,error) }
type StripeAdapter struct { sdk *stripe.Client }
func (a StripeAdapter) Charge(ctx context.Context,r PaymentRequest)(PaymentResult,error){
 raw,err:=a.sdk.MakeCharge(ctx,stripe.Params{Cents:r.Total.MinorUnits,Token:r.Token.String()}); if errors.Is(err,stripe.ErrDeclined){return PaymentResult{},ErrPaymentDeclined}; if err!=nil{return PaymentResult{},fmt.Errorf("stripe charge: %w",err)}; return translate(raw),nil
}
type CheckoutFacade struct{/* inventory, pricing, payments, orders */}`,
java:`final class StripeAdapter implements PaymentProcessor {
  private final LegacyStripeSdk sdk;
  public PaymentResult charge(PaymentRequest request){try{return map(sdk.makeCharge(request.total().minorUnits(),request.token().value(),request.total().currency().code()));}catch(StripeDeclined e){throw new PaymentDeclined(e.safeReason(),e);}}
}
final class CheckoutFacade { Receipt placeOrder(PlaceOrder command){var priced=pricing.calculate(command);var hold=inventory.reserve(priced.items());var payment=payments.charge(priced.payment());return orders.save(priced,hold,payment);} }`,
typescript:`interface PaymentProcessor{charge(request:PaymentRequest):Promise<PaymentResult>}
const stripeAdapter=(sdk:StripeSdk):PaymentProcessor=>({async charge(request){try{const raw=await sdk.makeCharge({amount_in_cents:request.total.minorUnits,source_token:request.token,currency_code:request.total.currency});return mapStripeResult(raw)}catch(error){if(isStripeDecline(error))throw new PaymentDeclined(safeReason(error));throw error}}});
// Structural compatibility may remove scaffolding only when semantics already align; units and errors still need translation.`};

export const commandExamples:Examples={
cpp:`struct Command { virtual ~Command()=default; virtual void execute()=0; virtual void undo()=0; };
class DeleteText final: public Command { Document& doc_; Range range_; std::string removed_;
public: DeleteText(Document& d,Range r):doc_(d),range_(r){} void execute()override{removed_=doc_.erase(range_);} void undo()override{doc_.insert(range_.start,removed_);} };
// History owns executed command objects; receiver references must outlive history.`,
go:`type Command func(context.Context) error
type Queue struct { pending []Command }
func (q *Queue) ExecuteNext(ctx context.Context) error {cmd:=q.pending[0];q.pending=q.pending[1:];return cmd(ctx)}
// A closure is enough for simple execution. Undoable commands benefit from structs storing prior state and receiver identity.`,
java:`interface Command { void execute(); void undo(); }
final class DeleteTextCommand implements Command {
  private final Document document; private final Range range; private String removed;
  public void execute(){removed=document.delete(range);} public void undo(){document.insert(range.start(),removed);}
}
final class History { private final Deque<Command> done=new ArrayDeque<>(); void execute(Command c){c.execute();done.push(c);} }`,
typescript:`interface Command{readonly name:string;execute():Promise<void>;undo?():Promise<void>}
class InsertText implements Command {readonly name="InsertText";private before="";constructor(private doc:Document,private text:string){}async execute(){this.before=this.doc.value;this.doc.insert(this.text)}async undo(){this.doc.value=this.before}}
// CapturePaymentCommand is not automatically retryable: idempotency belongs to its domain contract.`};

export const stateExamples:Examples={
cpp:`using OrderState=std::variant<Pending,Paid,Shipped,Delivered,Cancelled,Refunded>;
expected<OrderState,InvalidTransition> ship(OrderState state,TrackingId tracking){return std::visit(overloaded{
 [&](Paid){return OrderState{Shipped{tracking}};},
 [&](auto){return expected<OrderState,InvalidTransition>{unexpected(InvalidTransition{"ship"})};}
},state);} // variant encodes state-specific data without nullable tracking fields`,
go:`type OrderState string
const(Pending OrderState="pending";Paid OrderState="paid";Shipped OrderState="shipped")
var transitions=map[OrderState]map[Action]OrderState{Pending:{Pay:Paid,Cancel:Cancelled},Paid:{Ship:Shipped,Refund:Refunded}}
func Transition(current OrderState,action Action)(OrderState,error){next,ok:=transitions[current][action];if !ok{return current,InvalidTransition{current,action}};return next,nil}
// A typed enum + table is often clearer than state objects for a small FSM.`,
java:`interface OrderState { default OrderState ship(TrackingId id){throw new InvalidTransition(getClass().getSimpleName(),"ship");} }
record PaidState(PaymentId payment) implements OrderState { public OrderState ship(TrackingId id){return new ShippedState(payment,id);} }
record ShippedState(PaymentId payment,TrackingId tracking) implements OrderState {}
final class Order { private OrderState state; void ship(TrackingId id){state=state.ship(id);} }`,
typescript:`type Order =
 | {state:"pending"}
 | {state:"paid";paymentId:string}
 | {state:"shipped";paymentId:string;trackingId:string}
 | {state:"delivered";trackingId:string}
 | {state:"cancelled";reason:string};
function ship(order:Order,trackingId:string):Order{if(order.state!=="paid")throw new InvalidTransition(order.state,"ship");return {state:"shipped",paymentId:order.paymentId,trackingId}}
// Discriminated unions make state-specific data available only in the matching branch.`};

export const templateChainExamples:Examples={
cpp:`class ImportWorkflow {
public: virtual ~ImportWorkflow()=default;
 ImportResult import_file(File f){auto raw=open(f);validate_format(raw);auto doc=parse(raw);normalize(doc);persist(doc);report(doc);return {doc};}
protected: virtual Document parse(Bytes)=0; virtual void validate_format(Bytes){}; virtual void normalize(Document&){}
}; // Non-Virtual Interface: the public skeleton stays fixed; protected virtual hooks are the subclass API.
using Handler=std::function<Result(const PurchaseRequest&,Next)>; // a function vector may be clearer than owned linked objects`,
go:`type Parser interface{ Parse([]byte)(Document,error) }
type Importer struct{ parser Parser; store Store }
func(i Importer) Import(ctx context.Context,b []byte)(Document,error){doc,err:=i.parser.Parse(b);if err!=nil{return Document{},err};normalize(&doc);return doc,i.store.Save(ctx,doc)}
type Handler func(context.Context,Request) Response
type Middleware func(Handler) Handler
// Go solves Template Method pressure with composition; middleware composes a chain without class inheritance.`,
java:`abstract class ImportWorkflow {
 public final ImportResult importFile(File file){var raw=open(file);validateFormat(raw);var doc=parse(raw);normalize(doc);persist(doc);report(doc);return new ImportResult(doc);}
 protected abstract Document parse(byte[] raw); protected void validateFormat(byte[] raw){} protected void normalize(Document doc){}
}
interface Handler { Result handle(PurchaseRequest request, Next next); }`,
typescript:`abstract class ImportWorkflow { async importFile(file:File){const raw=await this.open(file);this.validate(raw);const doc=await this.parse(raw);this.normalize(doc);await this.persist(doc);return doc} protected abstract parse(raw:ArrayBuffer):Promise<Document>; protected normalize(_doc:Document){} }
type Handler=(ctx:Context,next:()=>Promise<void>)=>Promise<void>;
async function run(handlers:Handler[],ctx:Context){let i=-1;const next=async()=>{const h=handlers[++i];if(h)await h(ctx,next)};await next()}
// Array pipelines make order and short-circuit semantics explicit.`};

export const dependencyInjectionExamples:Examples={
cpp:`class CheckoutService { OrderRepository& orders_; PaymentProcessor& payments_;
public: CheckoutService(OrderRepository& o,PaymentProcessor& p):orders_(o),payments_(p){} };
int main(){DbPool db(config);PostgresOrders orders(db);StripePayments payments(http);CheckoutService checkout(orders,payments);}
// References are non-owning: the composition root must keep dependencies alive longer than consumers.`,
go:`func BuildApplication(cfg Config) *App {
 db:=NewDB(cfg.Database); repo:=NewOrderRepository(db); payments:=NewStripeProcessor(cfg.Stripe,NewHTTPClient());
 checkout:=NewCheckoutService(repo,payments,RealClock{}); return NewApp(checkout)
}
// Manual wiring is DI. Add a container only when graph/scopes genuinely justify it.`,
java:`final class CheckoutService { private final OrderRepository orders; private final PaymentProcessor payments;
 CheckoutService(OrderRepository orders,PaymentProcessor payments){this.orders=Objects.requireNonNull(orders);this.payments=Objects.requireNonNull(payments);}
}
var service=new CheckoutService(new PostgresOrderRepository(pool),new StripePaymentProcessor(http));
// Framework annotations are optional; required dependencies remain explicit and construction-valid.`,
typescript:`const PAYMENT=Symbol("PaymentProcessor"); // runtime containers need tokens because interfaces are erased
class CheckoutService { constructor(readonly orders:OrderRepository,readonly payments:PaymentProcessor,readonly clock:Clock){} }
export function buildApp(config:Config){const repo=new PostgresOrders(connect(config.db));const payment=stripeAdapter(new StripeClient(config.key));return new App(new CheckoutService(repo,payment,new SystemClock()))}
// Transparent manual wiring is often easier to inspect than reflective container magic.`};

export const domainModelingExamples:Examples={
cpp:`class Money { std::int64_t minor_; Currency currency_; public: Money(std::int64_t minor,Currency c):minor_(minor),currency_(c){if(minor<0)throw InvalidMoney{};} friend bool operator==(const Money&,const Money&)=default; };
class Booking { BookingId id_; std::vector<SeatId> seats_; BookingState state_;
public: void confirm(const PaymentReceipt& paid){if(state_!=BookingState::Pending||seats_.empty())throw InvalidBooking{};state_=BookingState::Confirmed;} };
// Value semantics suit Money; entity identity and history distinguish Booking.`,
go:`type Money struct{ minor int64; currency Currency }
func NewMoney(minor int64,c Currency)(Money,error){if minor<0{return Money{},ErrNegativeMoney};return Money{minor,c},nil}
type Booking struct{id BookingID; seats []SeatID; state BookingState}
func(b *Booking) Confirm(payment PaymentReceipt) error {if b.state!=Pending||len(b.seats)==0{return ErrInvalidBooking};b.state=Confirmed;return nil}
// Unexported fields plus constructors/methods protect invariants without inheritance.`,
java:`record Money(long minorUnits,Currency currency){Money{if(minorUnits<0)throw new IllegalArgumentException("negative money");Objects.requireNonNull(currency);}}
final class Booking {private final BookingId id;private final List<SeatId> seats;private BookingStatus status;
 void confirm(PaymentReceipt payment){if(status!=PENDING||seats.isEmpty())throw new InvalidBooking();status=CONFIRMED;}}
// Records fit values; behavior-rich classes fit identity and transitions when rules justify them.`,
typescript:`type BookingId=string&{readonly __brand:"BookingId"};
type Money=Readonly<{minorUnits:number;currency:"INR"|"USD"}>;
type Booking={id:BookingId;seats:readonly SeatId[];state:{kind:"pending";expiresAt:Date}|{kind:"confirmed";paymentId:string}|{kind:"cancelled";reason:string}};
function confirm(b:Booking,paymentId:string,now:Date):Booking{if(b.state.kind!=="pending"||b.state.expiresAt<=now||!b.seats.length)throw new InvalidBooking();return {...b,state:{kind:"confirmed",paymentId}}}
// Branded IDs, readonly values, and discriminated states can model a domain without class-per-noun.`};
