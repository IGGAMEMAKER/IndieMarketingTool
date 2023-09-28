export function Panel({id, header, noHelp}) {
  return <div id={id} className={"Panel"}>
    {/*<br/>*/}
    {/*<br/>*/}
    <h2>{header}</h2>
    <div>
      <details className={`need-help ${noHelp}`} style={{display: noHelp ? 'none' : ''}}>
        <summary className={"wavy"}>
          Struggling with that{/*"{id}"*/}?
        </summary>
        <button disabled>Examples</button>
        <button disabled>Read</button>
        <button className={"help"}>Help</button>
      </details>
    </div>
    <br/>
  </div>
}