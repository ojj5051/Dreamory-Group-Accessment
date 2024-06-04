const ReactRouter = () => {
    return (
            <Fragment>
                <Switch>
                    <Route exact path="/" component={Home} />
                    <Route path="/home" component={Home} />
                    <Route path="/login" component={Login} />
                </Switch>
            </Fragment>
    
            )
}
export default ReactRouter;