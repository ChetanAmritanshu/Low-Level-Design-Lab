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
cpp:`class DiscountPolicy {
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
go:`type DiscountPolicy interface { Apply(Money) Money }
type FestivalDiscount struct{}
func (FestivalDiscount) Apply(total Money) Money { return total.PercentOff(15) }

type PricingService struct{}
func (PricingService) Price(total Money, policy DiscountPolicy) Money {
  return policy.Apply(total)
}

// A function is also an honest extension point.
type DiscountFunc func(Money) Money
func (f DiscountFunc) Apply(total Money) Money { return f(total) }`,
java:`public interface DiscountPolicy {
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
typescript:`interface DiscountPolicy {
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
cpp:`class ReadableStorage {
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
go:`type ReadableStorage interface {
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
java:`public interface ReadableStorage {
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
typescript:`interface ReadableStorage {
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
