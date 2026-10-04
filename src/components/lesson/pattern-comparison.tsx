const rows=[
  ["Strategy","vary an algorithm","behavior","composition","high","context → one strategy","State","tiny stable branch"],
  ["Factory","choose + construct","creation","composition/function","high","creator → product","Builder","factory for every constructor"],
  ["Builder","assemble complex value","creation","composition","medium","steps → product","Factory","ceremony for simple values"],
  ["Singleton","one instance + access","creation","static / DI scope","low","global access","global variable","hidden mutable state"],
  ["Observer","fan event to reactions","behavior","composition","high","one-to-many","Pub/Sub","hidden critical workflow"],
  ["Decorator","stack optional behavior","structure","composition","high","wrapper → same contract","Proxy","untraceable tower"],
  ["Adapter","translate incompatibility","structure","composition","medium","domain → vendor","Decorator","method renaming only"],
  ["Facade","simplify subsystem access","structure","composition","medium","caller → facade → many","Adapter","god service"],
  ["Command","represent an action","behavior","object / closure","high","invoker → receiver","Event","class for immediate call"],
  ["State","behavior by lifecycle","behavior","composition / variant","medium","context → current state","Strategy","classes for two states"],
  ["Template Method","vary selected steps","behavior","inheritance","low","base skeleton → hooks","Strategy","too many hooks"],
  ["Chain of Responsibility","ordered request stages","behavior","composition","high","handler → next handler","Decorator","unspecified stop/order"],
] as const;

export function PatternComparison(){return <div className="pattern-comparison" role="region" aria-label="Design pattern comparison" tabIndex={0}><div className="pattern-comparison__row pattern-comparison__head"><span>PATTERN</span><span>PRIMARY PROBLEM</span><span>CATEGORY</span><span>MECHANISM</span><span>RUNTIME FLEX</span><span>RELATIONSHIP</span><span>CONFUSED WITH</span><span>COMMON MISUSE</span></div>{rows.map(row=><div className="pattern-comparison__row" key={row[0]}>{row.map((cell,n)=>n===0?<b key={cell}>{cell}</b>:<span key={cell}>{cell}</span>)}</div>)}</div>}
