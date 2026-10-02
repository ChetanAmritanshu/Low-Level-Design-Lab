export type Tone = "cyan" | "violet" | "amber" | "green" | "rose";
export type Topic = { number: string; title: string; shortTitle: string; slug: string; available: boolean };
export type TopicGroup = { id: string; label: string; eyebrow: string; tone: Tone; topics: Topic[] };

const titles = [
  "OOP Fundamentals", "Encapsulation & Abstraction", "Inheritance & Polymorphism", "Object Lifecycle & Ownership",
  "Single Responsibility Principle", "Open/Closed Principle", "Liskov Substitution Principle", "Interface Segregation + Dependency Inversion", "Coupling & Cohesion", "Composition vs Inheritance", "Interfaces & API Design", "Clean Code Fundamentals", "Advanced Clean Code", "Error Handling", "Logging & Observability", "Testing Fundamentals",
  "Strategy Pattern", "Factory Pattern", "Builder Pattern", "Singleton Pattern", "Observer Pattern", "Decorator Pattern", "Adapter + Facade", "Command Pattern", "State Pattern", "Template Method + Chain of Responsibility", "Dependency Injection", "Domain Modeling", "UML & Design Communication",
  "Concurrency Fundamentals", "Mutexes & Condition Variables", "Deadlocks & Locking Strategies", "Memory & Performance Awareness", "RAII & Smart Pointers", "Move Semantics & Copy Elision", "Virtual Dispatch Internals", "Thread Safety in C++",
  "Machine Coding Strategy", "Parking Lot", "Splitwise", "BookMyShow", "Elevator System", "Notification System", "Cab Booking System", "Food Delivery System", "Kafka-lite Queue", "Distributed Cache", "Trading Exchange", "Refactoring & Code Smells", "End-to-End Mock LLD Interview",
] as const;

const slugs = ["oop-fundamentals", "encapsulation-abstraction", "inheritance-polymorphism", "object-lifecycle-ownership", "single-responsibility-principle"];
const short: Record<number, string> = { 1:"Objects & Behavior", 2:"Boundaries", 3:"Polymorphism", 8:"ISP + DIP", 26:"Template + Chain", 29:"UML", 31:"Mutexes", 32:"Deadlocks", 34:"RAII", 35:"Move Semantics", 36:"Virtual Dispatch", 37:"C++ Thread Safety", 38:"Machine Coding", 46:"Kafka-lite", 50:"Mock Interview" };
const topic = (n: number): Topic => ({ number:String(n).padStart(2,"0"), title:titles[n-1], shortTitle:short[n] ?? titles[n-1], slug:n <= 5 ? `/learn/${slugs[n-1]}` : "", available:n <= 5 });

export const topicGroups: TopicGroup[] = [
  { id:"objects", label:"Object Thinking & OOP", eyebrow:"Model responsibilities", tone:"cyan", topics:[1,2,3,4].map(topic) },
  { id:"solid", label:"SOLID & Maintainability", eyebrow:"Make change affordable", tone:"violet", topics:Array.from({length:12},(_,i)=>topic(i+5)) },
  { id:"patterns", label:"Patterns & Extensibility", eyebrow:"Earn each abstraction", tone:"amber", topics:Array.from({length:13},(_,i)=>topic(i+17)) },
  { id:"runtime", label:"Concurrency & Runtime", eyebrow:"Protect shared state", tone:"green", topics:Array.from({length:8},(_,i)=>topic(i+30)) },
  { id:"coding", label:"Machine Coding", eyebrow:"Defend a complete design", tone:"rose", topics:Array.from({length:13},(_,i)=>topic(i+38)) },
];

export const interviewSystems = [
  ["Tic Tac Toe","FOUNDATION","state · rules · turns","35 min"], ["ATM","INTERMEDIATE","state · cash · errors","45 min"],
  ["Parking Lot","INTERMEDIATE","strategy · allocation","45 min"], ["Splitwise","ADVANCED","balances · settlement","60 min"],
  ["Elevator System","ADVANCED","scheduling · state","60 min"], ["BookMyShow","ADVANCED","locking · inventory","75 min"],
  ["Cab Booking","ADVANCED","matching · trips","75 min"], ["Kafka-lite Queue","EXPERT","concurrency · offsets","90 min"],
  ["Distributed Cache","EXPERT","eviction · thread safety","90 min"], ["Trading Exchange","EXPERT","orders · matching","90 min"],
] as const;
