import React from "react";
import { Card, CardHeader, CardContent, Grid } from "@material-ui/core";
import "./Cards.scss";

export default class Cards extends React.PureComponent {
  _renderCardByWorkCenter = () => {
    const { achievement } = this.props;
    return (
      <>
        {achievement &&
          achievement.map(achievement => (
            <Card className="card-grid-container" onClick={this.props.onClick}>
              <CardHeader className="card-header" title={achievement.Code} />
              <CardContent className="card-content">
                <Grid className="card-containers" container>
                  <Grid item xs={6} className="left-side">
                    <Grid container className="achievement-container">
                      <Grid item xs={12} className={"achievement-value-90"}>
                        {achievement.Percent}
                        <span>%</span>
                      </Grid>
                      <Grid item xs={12} className="achievement-text">
                        <span>Backlog Achievement</span>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={6} className="right-side">
                    <Grid container className="detail-container">
                      <Grid container className="backlog-total-container">
                        <Grid item xs={12} className="backlog-total">
                          <span className="backlog-text">Backlog Open : </span>
                          <span className="backlog-value">
                            {achievement.BackLogOpen}
                          </span>
                        </Grid>
                      </Grid>

                      <Grid
                        container
                        className="backlog-priority-container"
                        spacing={1}
                      >
                        {/* Mapping Priority here  */}
                        <Grid item xs={6} className="backlog-priority">
                          <Card className="card-priority">
                            <div className={"first-priority"}>
                              <div className="priority-title">
                                {"priority 1"}
                              </div>
                              <div className="priority-value">
                                {achievement.Priority1}
                              </div>
                            </div>
                          </Card>
                        </Grid>
                        {/* Mapping Priority here  */}
                        <Grid item xs={6} className="backlog-priority">
                          <Card className="card-priority">
                            <div className={"second-priority"}>
                              <div className="priority-title">
                                {"priority 2"}
                              </div>
                              <div className="priority-value">
                                {achievement.Priority2}
                              </div>
                            </div>
                          </Card>
                        </Grid>
                        {/* Mapping Priority here  */}
                        <Grid item xs={6} className="backlog-priority">
                          <Card className="card-priority">
                            <div className={"third-priority"}>
                              <div className="priority-title">
                                {"priority 3"}
                              </div>
                              <div className="priority-value">
                                {achievement.Priority3}
                              </div>
                            </div>
                          </Card>
                        </Grid>
                        {/* Mapping Priority here  */}
                        <Grid item xs={6} className="backlog-priority">
                          <Card className="card-priority">
                            <div className={"forth-priority"}>
                              <div className="priority-title">
                                {"priority 4"}
                              </div>
                              <div className="priority-value">
                                {achievement.Priority4}
                              </div>
                            </div>
                          </Card>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          ))}
      </>
    );
  };
  render() {
    const { achievement,workcenter} = this.props;
    if (workcenter) {
        return this._renderCardByWorkCenter()
    }
    return (
      <>
        <Card className="card-grid-container" onClick={this.props.onClick}>
          <CardHeader className="card-header" title={achievement.Code} />
          <CardContent className="card-content">
            <Grid className="card-containers" container>
              <Grid item xs={6} className="left-side">
                <Grid container className="achievement-container">
                  <Grid item xs={12} className={"achievement-value-90"}>
                    {achievement.Percent}
                    <span>%</span>
                  </Grid>
                  <Grid item xs={12} className="achievement-text">
                    <span>Backlog Achievement</span>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={6} className="right-side">
                <Grid container className="detail-container">
                  <Grid container className="backlog-total-container">
                    <Grid item xs={12} className="backlog-total">
                      <span className="backlog-text">Backlog Open : </span>
                      <span className="backlog-value">
                        {achievement.BackLogOpen}
                      </span>
                    </Grid>
                  </Grid>

                  <Grid
                    container
                    className="backlog-priority-container"
                    spacing={1}
                  >
                    {/* Mapping Priority here  */}
                    <Grid item xs={6} className="backlog-priority">
                      <Card className="card-priority">
                        <div className={"first-priority"}>
                          <div className="priority-title">{"priority 1"}</div>
                          <div className="priority-value">
                            {achievement.Priority1}
                          </div>
                        </div>
                      </Card>
                    </Grid>
                    {/* Mapping Priority here  */}
                    <Grid item xs={6} className="backlog-priority">
                      <Card className="card-priority">
                        <div className={"second-priority"}>
                          <div className="priority-title">{"priority 2"}</div>
                          <div className="priority-value">
                            {achievement.Priority2}
                          </div>
                        </div>
                      </Card>
                    </Grid>
                    {/* Mapping Priority here  */}
                    <Grid item xs={6} className="backlog-priority">
                      <Card className="card-priority">
                        <div className={"third-priority"}>
                          <div className="priority-title">{"priority 3"}</div>
                          <div className="priority-value">
                            {achievement.Priority3}
                          </div>
                        </div>
                      </Card>
                    </Grid>
                    {/* Mapping Priority here  */}
                    <Grid item xs={6} className="backlog-priority">
                      <Card className="card-priority">
                        <div className={"forth-priority"}>
                          <div className="priority-title">{"priority 4"}</div>
                          <div className="priority-value">
                            {achievement.Priority4}
                          </div>
                        </div>
                      </Card>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </>
    );
  }
}
