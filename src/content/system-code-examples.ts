import type {Language} from "@/components/code/multi-language-code";
type Examples=Record<Language,string>;

export const parkingExamples:Examples={cpp:`enum class VehicleType{Bike,Car,Truck};
enum class SpotType{Bike,Compact,Large};
struct Vehicle{std::string plate;VehicleType type;};
struct Ticket{TicketId id;SpotId spot;Vehicle vehicle;TimePoint entered;TicketState state;};
class SpotSelectionPolicy{public:virtual ~SpotSelectionPolicy()=default;virtual optional<SpotId> choose(const Vehicle&,span<const Spot>)const=0;};
class ParkingLot{
 std::mutex mutex_;unordered_map<SpotId,Spot> spots_;unordered_map<TicketId,Ticket> tickets_;
public: expected<Ticket,ParkError> park(const Vehicle& v){
  scoped_lock lock(mutex_);auto id=selector_->choose(v,available(spots_));
  if(!id)return unexpected(ParkError::Full);spots_.at(*id).occupy(v.plate);
  auto ticketId=newId();
  return tickets_.emplace(ticketId,Ticket{ticketId,*id,v,clock_->now(),TicketState::Active}).first->second;
 }
 expected<Receipt,ExitError> exit(TicketId id){/* validate → price → pay → close + release exactly once */}
};`,go:`type VehicleType int; const(Bike VehicleType=iota;Car;Truck)
type Spot struct{ID string;Kind SpotType;VehiclePlate string}
type Ticket struct{ID,SpotID string;Vehicle Vehicle;Entered time.Time;State TicketState}
type SelectionPolicy interface{Choose(Vehicle,[]Spot)(string,bool)}
type ParkingLot struct{mu sync.Mutex;spots map[string]*Spot;tickets map[string]*Ticket;selectSpot SelectionPolicy}
func(p *ParkingLot)Park(v Vehicle)(Ticket,error){
 p.mu.Lock();defer p.mu.Unlock()
 id,ok:=p.selectSpot.Choose(v,p.available());if !ok{return Ticket{},ErrFull}
 p.spots[id].VehiclePlate=v.Plate;t:=Ticket{ID:newID(),SpotID:id,Vehicle:v,Entered:p.clock.Now(),State:Active}
 p.tickets[t.ID]=&t;return t,nil
}`,java:`record Vehicle(String plate,VehicleType type){}
record ParkingTicket(TicketId id,SpotId spot,Vehicle vehicle,Instant entered,TicketState state){}
interface SpotSelectionPolicy{Optional<SpotId> choose(Vehicle vehicle,List<ParkingSpot> available);}
final class ParkingLot{
 private final Lock lock=new ReentrantLock();private final Map<SpotId,ParkingSpot> spots;
 ParkingTicket park(Vehicle vehicle){lock.lock();try{
  var id=selection.choose(vehicle,available()).orElseThrow(ParkingFull::new);
  spots.get(id).occupy(vehicle.plate());var ticket=ParkingTicket.active(id,vehicle,clock.instant());
  tickets.put(ticket.id(),ticket);return ticket;
 }finally{lock.unlock();}}
}`,typescript:`type Vehicle={plate:string;kind:"BIKE"|"CAR"|"TRUCK"};
type Spot={id:string;kind:"BIKE"|"COMPACT"|"LARGE";vehicle?:string};
interface SpotSelectionPolicy{choose(vehicle:Vehicle,spots:readonly Spot[]):Spot|undefined}
class ParkingLot{
 constructor(private spots:Map<string,Spot>,private selection:SpotSelectionPolicy,private clock:Clock){}
 park(vehicle:Vehicle):Result<Ticket,"FULL">{
  const spot=this.selection.choose(vehicle,[...this.spots.values()].filter(s=>!s.vehicle));
  if(!spot)return err("FULL");spot.vehicle=vehicle.plate;
  return ok({id:crypto.randomUUID(),spotId:spot.id,vehicle,enteredAt:this.clock.now(),state:"ACTIVE"});
 }
 // A server implementation serializes this check+transition or uses compare-and-set.
}`};

export const splitwiseExamples:Examples={cpp:`struct Money{int64_t minor;Currency currency;};
struct Split{UserId user;Money owed;};
class ExpenseSplitPolicy{public:virtual ~ExpenseSplitPolicy()=default;virtual expected<vector<Split>,SplitError> split(Money,span<const Share>)const=0;};
vector<Split> EqualSplit::split(Money total,span<const Share> shares)const{
 auto base=total.minor/shares.size(),remainder=total.minor%shares.size();vector<Split> out;
 for(size_t i=0;i<shares.size();++i)out.push_back({shares[i].user,{base+(i<(size_t)remainder),total.currency}});
 return out; // integer minor units; deterministic remainder by stable participant order
}
void Ledger::post(const Expense& e){for(auto s:e.splits)balances_[{s.user,e.paidBy}]+=s.owed.minor;}`,go:`type Money struct{Minor int64;Currency string}
type Split struct{UserID string;Owed Money}
type SplitPolicy interface{Split(Money,[]Share)([]Split,error)}
func Equal(total Money,users []string)[]Split{base,rem:=total.Minor/int64(len(users)),total.Minor%int64(len(users));out:=make([]Split,len(users));for i,u:=range users{extra:=int64(0);if int64(i)<rem{extra=1};out[i]=Split{u,Money{base+extra,total.Currency}}};return out}
// Ledger stores pairwise obligations; simplification is an optional read model, not expense history.`,java:`record Money(long minor,Currency currency){Money{if(minor<0)throw new IllegalArgumentException();}}
record Split(UserId user,Money owed){}
sealed interface ExpenseSplitPolicy permits EqualSplit,ExactSplit,PercentageSplit{List<Split> split(Money total,List<Share> shares);}
final class EqualSplit implements ExpenseSplitPolicy{public List<Split> split(Money total,List<Share> shares){
 long base=total.minor()/shares.size(),remainder=total.minor()%shares.size();
 return IntStream.range(0,shares.size()).mapToObj(i->new Split(shares.get(i).user(),new Money(base+(i<remainder?1:0),total.currency()))).toList();
}}`,typescript:`type Money=Readonly<{minor:bigint;currency:"INR"}>;
type Split=Readonly<{userId:string;owed:Money}>;
interface ExpenseSplitPolicy{split(total:Money,shares:readonly Share[]):Result<Split[],SplitError>}
class PercentageSplit implements ExpenseSplitPolicy{
 split(total:Money,shares:readonly Share[]){
  if(shares.reduce((n,s)=>n+s.basisPoints,0)!==10_000)return err("PERCENT_TOTAL");
  const result=shares.map(s=>({...s,owed:{...total,minor:total.minor*BigInt(s.basisPoints)/10_000n}}));
  distributeRemainderDeterministically(result,total.minor);return ok(result);
 }
}`};

export const bookingExamples:Examples={cpp:`enum class ShowSeatState{Available,Held,Booked};
struct ShowSeat{ShowId show;SeatId seat;ShowSeatState state;optional<HoldId> hold;TimePoint expiresAt;};
class ShowSeatRepository{public:virtual expected<Hold,HoldError> tryHold(ShowId,span<const SeatId>,UserId,TimePoint)=0;};
expected<Hold,HoldError> InMemorySeats::tryHold(ShowId show,span<const SeatId> ids,UserId user,TimePoint expiry){
 scoped_lock lock(mutex_); // validate all, then mutate all
 if(any_of(ids.begin(),ids.end(),[&](auto id){return !isAvailableOrExpired(show,id,clock_->now());}))return unexpected(HoldError::Unavailable);
 Hold hold{newId(),show,user,ids,expiry};for(auto id:ids)seats_.at({show,id}).hold(hold.id,expiry);return hold;
}
// Payment success is not booking success until confirm changes every held ShowSeat to Booked.`,go:`type ShowSeat struct{ShowID,SeatID string;State SeatState;HoldID string;ExpiresAt time.Time}
func(r *SeatRepo)TryHold(show string,ids []string,user string,expiry time.Time)(Hold,error){
 r.mu.Lock();defer r.mu.Unlock();now:=r.clock.Now()
 for _,id:=range ids{if !r.availableOrExpired(show,id,now){return Hold{},ErrUnavailable}}
 h:=Hold{ID:newID(),ShowID:show,SeatIDs:append([]string(nil),ids...),ExpiresAt:expiry}
 for _,id:=range ids{r.seats[key(show,id)].Hold(h.ID,expiry)};return h,nil
}`,java:`enum ShowSeatState{AVAILABLE,HELD,BOOKED}
record Hold(HoldId id,ShowId show,List<SeatId> seats,UserId user,Instant expiresAt){}
final class InMemoryShowSeats implements ShowSeatRepository{
 synchronized Hold tryHold(ShowId show,List<SeatId> ids,UserId user,Instant expiry){
  var now=clock.instant();if(ids.stream().anyMatch(id->!availableOrExpired(show,id,now)))throw new SeatUnavailable();
  var hold=new Hold(HoldId.newId(),show,List.copyOf(ids),user,expiry);
  ids.forEach(id->seats.get(new ShowSeatKey(show,id)).hold(hold.id(),expiry));return hold;
 }
}`,typescript:`type ShowSeat={showId:string;seatId:string;state:"AVAILABLE"|"HELD"|"BOOKED";holdId?:string;expiresAt?:number};
class ShowSeatStore{
 async tryHold(showId:string,seatIds:string[],userId:string,expiresAt:number):Promise<Result<Hold,"UNAVAILABLE">>{
  return this.serial.run(async()=>{const now=this.clock.now();const seats=seatIds.map(id=>this.get(showId,id));
   if(seats.some(s=>!this.availableOrExpired(s,now)))return err("UNAVAILABLE");
   const hold={id:crypto.randomUUID(),showId,seatIds,userId,expiresAt};seats.forEach(s=>Object.assign(s,{state:"HELD",holdId:hold.id,expiresAt}));return ok(hold);
  });
 }
}`};

export const elevatorExamples:Examples={cpp:`struct HallRequest{int floor;Direction direction;};struct CarRequest{ElevatorId car;int destination;};
struct Elevator{int floor;Motion motion;DoorState door;set<int> upStops;set<int,greater<int>> downStops;};
class Scheduler{public:virtual ElevatorId assign(const HallRequest&,span<const Elevator>)const=0;};
void Elevator::tick(){
 if(door!=DoorState::Closed){advanceDoor();return;}
 auto target=nextStop();if(!target){motion=Motion::Idle;return;}
 if(*target==floor){door=DoorState::Opening;removeStop(*target);return;}
 motion=*target>floor?Motion::Up:Motion::Down;floor+=motion==Motion::Up?1:-1;
}
// One event-loop owner processes hall/car requests and ticks; no shared mutable car state.`,go:`type HallRequest struct{Floor int;Direction Direction};type CarRequest struct{ElevatorID string;Destination int}
type Elevator struct{Floor int;Motion Motion;Door DoorState;Up,Down OrderedStops}
func(e *Elevator)Tick(){if e.Door!=Closed{e.AdvanceDoor();return};target,ok:=e.NextStop();if !ok{e.Motion=Idle;return};if target==e.Floor{e.Door=Opening;e.Remove(target);return};if target>e.Floor{e.Motion=MovingUp;e.Floor++}else{e.Motion=MovingDown;e.Floor--}}
// Requests enter a channel consumed by one controller goroutine.`,java:`record HallRequest(int floor,Direction direction){} record CarRequest(ElevatorId elevator,int destination){}
final class ElevatorCar{private int floor;private Motion motion;private DoorState door;private final NavigableSet<Integer> up=new TreeSet<>(),down=new TreeSet<>(reverseOrder());
 void tick(){if(door!=DoorState.CLOSED){advanceDoor();return;}var target=nextStop();if(target.isEmpty()){motion=Motion.IDLE;return;}if(target.get()==floor){door=DoorState.OPENING;removeStop(floor);return;}motion=target.get()>floor?Motion.MOVING_UP:Motion.MOVING_DOWN;floor+=motion==Motion.MOVING_UP?1:-1;}}
// Controller owns cars and drains an event queue deterministically.`,typescript:`type HallRequest={floor:number;direction:"UP"|"DOWN"};type CarRequest={elevatorId:string;destination:number};
class ElevatorCar{floor=1;motion:"IDLE"|"UP"|"DOWN"="IDLE";door:"OPEN"|"CLOSED"="CLOSED";upStops=new Set<number>();downStops=new Set<number>();
 tick(){if(this.door==="OPEN"){this.door="CLOSED";return}const target=this.nextStop();if(target===undefined){this.motion="IDLE";return}if(target===this.floor){this.door="OPEN";this.remove(target);return}this.motion=target>this.floor?"UP":"DOWN";this.floor+=this.motion==="UP"?1:-1}}
// setInterval may produce ticks, but only the controller mutates state.`};

export const notificationExamples:Examples={cpp:`enum class Channel{Email,Sms,Push};
struct Notification{NotificationId id;Recipient recipient;TemplateId templateId;map<string,string> data;vector<Channel> channels;};
struct NotificationResult{Channel channel;DeliveryStatus status;optional<ProviderId> provider;optional<FailureCode> failure;int attempts;};
class ChannelSender{public:virtual NotificationResult send(const RenderedMessage&,const Recipient&,IdempotencyKey)=0;};
vector<NotificationResult> Service::send(const Notification& n){vector<NotificationResult> out;for(auto channel:n.channels){
 if(!preferences_.allows(n.recipient.id,channel)){out.push_back(skipped(channel));continue;}
 auto message=renderer_.render(n.templateId,n.data,channel);out.push_back(senders_.at(channel)->send(message,n.recipient,{n.id,channel}));
 }return out;}
// Log notificationId, channel, provider, latency, status—never recipient secrets or rendered body.`,go:`type Notification struct{ID string;Recipient Recipient;TemplateID string;Data map[string]string;Channels []Channel}
type Result struct{Channel Channel;Status Status;Provider,Failure string;Attempts int}
type Sender interface{Send(context.Context,RenderedMessage,Recipient,IdempotencyKey)Result}
func(s *Service)Send(ctx context.Context,n Notification)[]Result{out:=[]Result{};for _,ch:=range n.Channels{if !s.prefs.Allows(n.Recipient.ID,ch){out=append(out,Skipped(ch));continue};msg:=s.renderer.Render(n.TemplateID,n.Data,ch);out=append(out,s.senders[ch].Send(ctx,msg,n.Recipient,Key(n.ID,ch)))};return out}`,java:`record Notification(NotificationId id,Recipient recipient,TemplateId template,Map<String,String> data,List<Channel> channels){}
record NotificationResult(Channel channel,DeliveryStatus status,Optional<ProviderId> provider,Optional<FailureCode> failure,int attempts){}
interface ChannelSender{NotificationResult send(RenderedMessage message,Recipient recipient,IdempotencyKey key);}
final class NotificationService{List<NotificationResult> send(Notification n){return n.channels().stream().map(ch->{
 if(!preferences.allows(n.recipient().id(),ch))return Results.skipped(ch);
 var message=renderer.render(n.template(),n.data(),ch);return senders.get(ch).send(message,n.recipient(),IdempotencyKey.of(n.id(),ch));
}).toList();}}`,typescript:`type Notification={id:string;recipient:Recipient;templateId:string;data:Record<string,string>;channels:Channel[]};
type NotificationResult={channel:Channel;status:"SENT"|"FAILED"|"SKIPPED_BY_PREFERENCE";provider?:string;failure?:string;attempts:number};
interface ChannelSender{send(message:RenderedMessage,to:Recipient,key:string):Promise<NotificationResult>}
class NotificationService{async send(n:Notification){return Promise.all(n.channels.map(async channel=>{
 if(!this.preferences.allows(n.recipient.id,channel))return {channel,status:"SKIPPED_BY_PREFERENCE",attempts:0} as const;
  const message=this.renderer.render(n.templateId,n.data,channel);return this.senders.get(channel)!.send(message,n.recipient,n.id+":"+channel);
 }))}}
// Provider adapters classify transient/permanent failures; RetryPolicy owns bounded retry/fallback.`};
