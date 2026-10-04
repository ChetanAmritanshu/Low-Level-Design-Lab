const rows=[
  ["Strategy","vary an algorithm","behavior","one selected behavior","composition","pattern for a tiny stable branch"],
  ["Factory","choose and construct a concrete object","creation","one created product","function, composition, sometimes inheritance","factory for every constructor"],
  ["Builder","assemble one complex object clearly","creation","one product over steps","fluent composition","ceremony for simple values"],
  ["Singleton","control one instance and expose global access","lifetime + access","one shared instance","static/module lifetime","hidden mutable global state"],
  ["Observer","fan one event to independent reactions","behavior collaboration","one-to-many","subscription/composition","hidden critical workflows"],
] as const;

export function PatternComparison(){return <div className="pattern-comparison" role="region" aria-label="Design pattern comparison"><div className="pattern-comparison__row pattern-comparison__head"><span>PATTERN</span><span>PRIMARY PROBLEM</span><span>CREATION / BEHAVIOR</span><span>RELATIONSHIP</span><span>MECHANISM</span><span>TYPICAL MISUSE</span></div>{rows.map(row=><div className="pattern-comparison__row" key={row[0]}>{row.map((cell,n)=>n===0?<b key={cell}>{cell}</b>:<span key={cell}>{cell}</span>)}</div>)}</div>}
