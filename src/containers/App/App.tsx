import * as React from 'react';

interface AppProps {
  children?: React.ReactNode;
}

function App(props: AppProps): React.ReactElement {
  return <div>App {props.children}</div>;
}

export default App;
