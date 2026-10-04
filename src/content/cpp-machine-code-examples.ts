import type { Language } from "@/components/code/multi-language-code";
type Examples=Record<Language,string>;

export const raiiExamples:Examples={cpp:`class FileHandle {
  std::FILE* file_{};
public:
  explicit FileHandle(const char* path):file_(std::fopen(path,"rb")){if(!file_)throw FileError{};}
  ~FileHandle() noexcept { if(file_) std::fclose(file_); }
  FileHandle(const FileHandle&)=delete;
  FileHandle& operator=(const FileHandle&)=delete;
};
using CFile=std::unique_ptr<std::FILE,decltype(&std::fclose)>;
// RAII applies to files, locks, sockets, transactions, threads, and memory.`,go:`file,err:=os.Open(path); if err!=nil{return err}
defer file.Close()
mu.Lock(); defer mu.Unlock()
// GC manages memory; defer expresses function-scoped cleanup, not C++ object-lifetime destruction.`,java:`try (var input=Files.newInputStream(path)) { return parse(input); }
// GC does not close a file, socket, or database connection at the logical end of use.`,typescript:`const controller=new AbortController();
try { await run(controller.signal) } finally { controller.abort(); subscription.unsubscribe(); }
// GC reclaims memory; logical resources still need explicit cleanup.`};

export const moveExamples:Examples={cpp:`class Buffer {
 std::unique_ptr<std::byte[]> data_; std::size_t size_{};
public:
 explicit Buffer(std::size_t n):data_(std::make_unique<std::byte[]>(n)),size_(n){}
 Buffer(Buffer&&) noexcept=default; Buffer& operator=(Buffer&&) noexcept=default;
 Buffer(const Buffer&)=delete; Buffer& operator=(const Buffer&)=delete;
};
Buffer make_buffer(){return Buffer{1'000'000};} // direct construction/copy elision may mean zero moves`,go:`b:=a // copies a value; slices/maps/channels copy descriptor-like values that can refer to shared backing state
// Go has no user-defined C++ move-constructor system. Document aliasing instead.`,java:`var b=a; // copies an object reference, not the object
// Java ownership transfer is a design convention; try-with-resources handles logical resource cleanup.`,typescript:`const b=a; // object reference alias, not deep copy
const clone=structuredClone(a); // explicit copy with its own supported-type semantics
// Neither operation is a C++ move constructor.`};

export const dispatchExamples:Examples={cpp:`class PaymentProcessor { public: virtual ~PaymentProcessor()=default; virtual Receipt pay(Money)=0; };
class StripeProcessor final:public PaymentProcessor { public: Receipt pay(Money m) override{return stripe_.charge(m);} private: StripeSdk stripe_; };
std::unique_ptr<PaymentProcessor> p=std::make_unique<StripeProcessor>();
auto receipt=p->pay(total); // commonly indirect; exact vtable/vptr layout is not standardized`,go:`type PaymentProcessor interface{Pay(Money)(Receipt,error)}
// Interface dispatch uses Go runtime mechanisms, not C++ base subobjects or inheritance.`,java:`interface PaymentProcessor{Receipt pay(Money total);}
PaymentProcessor p=new StripeProcessor(); p.pay(total);
// Java's object model provides runtime method dispatch; ownership remains GC-managed.`,typescript:`interface PaymentProcessor{pay(total:Money):Promise<Receipt>}
const p:PaymentProcessor=new StripeProcessor(); await p.pay(total);
// JS ultimately performs dynamic property/prototype lookup; TypeScript types are erased.`};

export const threadSafetyExamples:Examples={cpp:`class Inventory {
 mutable std::mutex mutex_; int available_;
public:
 explicit Inventory(int n):available_(n){}
 bool try_reserve(int n){std::lock_guard lock(mutex_);if(n<=0||available_<n)return false;available_-=n;return true;}
 int available() const {std::lock_guard lock(mutex_);return available_;}
};
// Thread-safe methods do not make available()+reserve() an atomic workflow; expose try_reserve().`,go:`type Inventory struct{mu sync.Mutex;available int}
func(i *Inventory)TryReserve(n int)bool{i.mu.Lock();defer i.mu.Unlock();if n<=0||i.available<n{return false};i.available-=n;return true}`,java:`final class Inventory{private final ReentrantLock lock=new ReentrantLock();private int available;
 boolean tryReserve(int n){lock.lock();try{if(n<=0||available<n)return false;available-=n;return true;}finally{lock.unlock();}}}`,typescript:`class Inventory{#available:number;#tail=Promise.resolve();
 tryReserve(n:number){return this.#serialize(()=>{if(n<=0||this.#available<n)return false;this.#available-=n;return true})}}
// This serializes async tasks; workers sharing memory need Atomics or another explicit boundary.`};

export const machineCodingExamples:Examples={cpp:`class ParkingLot { public: expected<Ticket,ParkError> park(const Vehicle&); expected<Receipt,ExitError> exit(TicketId); };
// Values by value; borrowed inputs by const&; unique_ptr only for real dynamic ownership; STL containers first.`,go:`type ParkingLot struct{/* explicit state */}
func(p *ParkingLot)Park(v Vehicle)(Ticket,error)
func(p *ParkingLot)Exit(id TicketID)(Receipt,error)
// Small interfaces belong at change/testing boundaries; do not imitate Java class hierarchies.`,java:`final class ParkingLot{ParkingTicket park(Vehicle vehicle);Receipt exit(TicketId ticket);}
interface PricingPolicy{Money price(ParkingStay stay);}
// Constructor injection, enums, and collections are enough; avoid frameworks in the interview core.`,typescript:`class ParkingLot{park(vehicle:Vehicle):Result<ParkingTicket,ParkError>;exit(ticketId:TicketId):Result<Receipt,ExitError>}
type Vehicle={kind:"bike"|"car"|"truck";plate:string};
// Use discriminated unions, Map/Set, and transparent dependency injection.`};
