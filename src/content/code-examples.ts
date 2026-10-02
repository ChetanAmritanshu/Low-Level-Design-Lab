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
