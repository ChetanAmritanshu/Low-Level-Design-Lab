const rows=[
  ["Strategy","vary an algorithm","behavior","one selected behavior","composition / function","tiny stable branch","State"],
  ["Factory","choose and construct an object","creation","creator → product","function / registry","factory for every constructor","Builder"],
  ["Builder","assemble one complex object","creation","steps → one product","fluent / options","ceremony for simple values","Factory"],
  ["Singleton","control one instance + access","lifetime","one shared instance","static / module / DI scope","hidden mutable global state","global variable"],
  ["Observer","fan an event to reactions","behavior","one-to-many","subscription / callbacks","hidden critical workflow","Pub/Sub"],
  ["Decorator","stack optional behavior","structure","wrapper → same contract","composition / middleware","untraceable wrapper tower","Proxy"],
  ["Adapter","translate incompatibility","structure","domain → adapter → vendor","wrapper / conversion","method-renaming wrapper","Decorator"],
  ["Facade","simplify subsystem access","structure","caller → facade → many","coarse entry API","god service","Adapter"],
  ["Command","represent an action","behavior","invoker → command → receiver","object / closure","class for immediate one-liner","Event"],
  ["State","vary behavior by lifecycle","behavior","context → current state","enum / table / objects","classes for two trivial states","Strategy"],
] as const;

export function PatternComparison(){return <div className="pattern-comparison" role="region" aria-label="Design pattern comparison" tabIndex={0}><div className="pattern-comparison__row pattern-comparison__head"><span>PATTERN</span><span>PRIMARY PROBLEM</span><span>FAMILY</span><span>RELATIONSHIP</span><span>MECHANISM</span><span>TYPICAL MISUSE</span><span>CONFUSED WITH</span></div>{rows.map(row=><div className="pattern-comparison__row" key={row[0]}>{row.map((cell,n)=>n===0?<b key={cell}>{cell}</b>:<span key={cell}>{cell}</span>)}</div>)}</div>}
