import type { Language } from "@/components/code/multi-language-code";
type Examples=Record<Language,string>;

export const umlExamples:Examples={
cpp:`struct PaymentProcessor { virtual ~PaymentProcessor()=default; virtual Receipt charge(Money)=0; };
class Order { CustomerId customer_; std::vector<OrderItem> items_; PaymentProcessor& payments_; };
// composition: Order owns items; association: customer ID; dependency: non-owning processor reference`,
go:`type PaymentProcessor interface{ Charge(context.Context,Money)(Receipt,error) }
type Order struct{ CustomerID CustomerID; Items []OrderItem; payments PaymentProcessor }
// Go has no class-diagram inheritance arrow: interface satisfaction is implicit.`,
java:`interface PaymentProcessor { Receipt charge(Money total); }
final class Order { private final CustomerId customer; private final List<OrderItem> items; private final PaymentProcessor payments; }
// Show multiplicity and ownership only when they answer the design question.`,
typescript:`interface PaymentProcessor{charge(total:Money):Promise<Receipt>}
type Order={customerId:CustomerId;items:readonly OrderItem[]};
// Structural typing means an implementation arrow communicates intent, not a runtime relationship.`};

export const concurrencyExamples:Examples={
cpp:`std::atomic<int> inventory{2};
bool try_sell(){int seen=inventory.load();while(seen>0){if(inventory.compare_exchange_weak(seen,seen-1))return true;}return false;}
// Unsynchronized conflicting C++ accesses are a data race and undefined behavior.`,
go:`var mu sync.Mutex
func withdraw(n int) bool { mu.Lock(); defer mu.Unlock(); if balance<n{return false}; balance-=n; return true }
// Goroutines are scheduled by the Go runtime; they are not one-to-one promises of OS threads.`,
java:`private final AtomicInteger inventory=new AtomicInteger(2);
boolean trySell(){for(;;){int n=inventory.get();if(n==0)return false;if(inventory.compareAndSet(n,n-1))return true;}}
// volatile gives visibility/order for a field, not atomicity for multi-step invariants.`,
typescript:`let balance=100;
async function withdraw(n:number){const seen=balance;await authorize();if(seen>=n)balance=seen-n;}
// Event-loop code can have a logical race across await boundaries; it is not a C++ data race.`};

export const mutexConditionExamples:Examples={
cpp:`std::mutex m; std::condition_variable changed; std::queue<Job> q;
Job take(){std::unique_lock lock(m);changed.wait(lock,[&]{return !q.empty();});auto j=q.front();q.pop();return j;}
// wait releases the mutex, sleeps, reacquires it, then rechecks the predicate.`,
go:`mu.Lock()
for len(queue)==0 { notEmpty.Wait() }
job:=queue[0]; queue=queue[1:]
mu.Unlock()
// sync.Cond.Wait returns holding the lock; use a loop.`,
java:`lock.lock();
try { while(queue.isEmpty()) notEmpty.await(); return queue.remove(); }
finally { lock.unlock(); }
// ReentrantLock + Condition makes the predicate's lock discipline explicit.`,
typescript:`class AsyncQueue<T>{private items:T[]=[];private waiters:Array<(x:T)=>void>=[];
 push(x:T){const w=this.waiters.shift();w?w(x):this.items.push(x)}
 pop(){const x=this.items.shift();return x?Promise.resolve(x):new Promise<T>(r=>this.waiters.push(r))}}
// This coordinates asynchronous tasks; it is not an OS-thread condition variable.`};

export const deadlockExamples:Examples={
cpp:`void transfer(Account& a,Account& b,Money n){std::scoped_lock lock(a.mutex(),b.mutex());a.debit(n);b.credit(n);}
// scoped_lock avoids deadlock while acquiring the pair.`,
go:`func lockPair(a,b *Account) func(){if a.ID>b.ID{a,b=b,a};a.mu.Lock();b.mu.Lock();return func(){b.mu.Unlock();a.mu.Unlock()}}
// A stable global order removes circular wait; every caller must follow it.`,
java:`Account first=a.id().compareTo(b.id())<0?a:b; Account second=first==a?b:a;
first.lock.lock(); try{second.lock.lock();try{move(a,b,n);}finally{second.lock.unlock();}}finally{first.lock.unlock();}
// Fair locks can reduce starvation but often trade away throughput.`,
typescript:`const snapshot=await mutex.runExclusive(()=>state.snapshot());
const result=await callRemote(snapshot);
await mutex.runExclusive(()=>state.commit(result));
// Do not hold an async mutex across an open network call.`};

export const memoryPerformanceExamples:Examples={
cpp:`std::vector<Particle> particles;
for(auto& p:particles) p.step();
// Contiguous traversal often beats pointer chasing. Verify architecture-dependent layout wins.`,
go:`type Node struct{value int;next *Node}
// Escape analysis decides placement; verify with compiler diagnostics and profiles.
items:=make([]Item,0,expected)`,
java:`var items=new ArrayList<Item>(expected);
// JIT escape analysis may eliminate allocations; it is not guaranteed source-level placement.
// Use JFR/profilers and JMH for careful microbenchmarks.`,
typescript:`const xs=new Float64Array(count);
// Engine object representations are not a portable stack-versus-heap promise.
// Heap snapshots show retained paths; profiles show whether allocation is hot.`};
