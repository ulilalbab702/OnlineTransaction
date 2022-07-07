import React from 'react';
import {Card,CardHeader,CardContent,Grid} from '@material-ui/core';
import styles from './CardProblemLog.module.scss';

export default class CardProblemLog extends React.PureComponent{
    render(){
        const {data,title,subTitle,leftValue,midValue,rightValue} = this.props;
        return(
            <Card
                className='card-grid-container'
                onClick={this.props.onClick}
            >
                <CardHeader
                    className='card-header'
                    title={title}
                />
                <CardContent className={styles['card-content']}>
                    <Grid
                        item={true}
                        className={styles['card-containers']}
                        container
                    >
                        <Grid item xs={6} className={styles['left-side']}>
                            <Grid 
                            className={styles['achievement-container']}
                            container
                            >
                                <Grid
                                    className={styles['achievement-value-90']}
                                    item xs={12}
                                >
                                    {data.Percent}
                                    <span>%</span>
                                </Grid>
                                <Grid
                                    className={styles['achievement-text']}
                                    item xs={12}
                                >
                                    <span>Problemlog Achievement</span>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={6} className={styles['right-side']}>
                            <Grid 
                                className={styles['detail-container']}
                                container
                            >
                                {/* Problem Log Open with cards*/}
                                <Grid
                                    className={styles['problemlog-total-container']}
                                    container
                                >
                                    <Grid 
                                        className={styles['problemlog-total']}
                                        item xs={12}
                                    >
                                    <span>{`${subTitle[0]} : `}</span>
                                    <span className={styles['problemlog-value']}>{data.TotalOpen}</span>
                                    </Grid>
                                </Grid>
                                <Grid 
                                    className={styles['problemlog-priority-container']}
                                    container 
                                    spacing={1}
                                >
                                    {/* Mapping Priority here */}
                                    <Grid 
                                        className={styles['problemlog-priority']}
                                        item xs={4}
                                    >
                                        <Card
                                            className={styles['card-impact-type']}
                                        >
                                            <div className={styles['impact-type']}>
                                                <div className={styles['impact-title']}>
                                                    {subTitle[1]}
                                                </div>
                                                <div className={styles['impact-value']}>
                                                    {data.HighOpen}
                                                </div>
                                            </div>
                                        </Card>
                                    </Grid>
                                    {/* Mapping Priority here */}
                                    <Grid 
                                        className={styles['problemlog-priority']}
                                        item xs={4}
                                    >
                                        <Card
                                            className={styles['card-impact-type']}
                                        >
                                            <div className={styles['impact-type']}>
                                                <div className={styles['impact-title']}>
                                                    {subTitle[2]}
                                                </div>
                                                <div className={styles['impact-value']}>
                                                    {data.MediumOpen}
                                                </div>
                                            </div>
                                        </Card>
                                    </Grid>
                                    {/* Mapping Priority here */}
                                    <Grid 
                                        className={styles['problemlog-priority']}
                                        item xs={4}
                                    >
                                        <Card
                                            className={styles['card-impact-type']}
                                        >
                                            <div className={styles['impact-type']}>
                                                <div className={styles['impact-title']}>
                                                    {subTitle[3]}
                                                </div>
                                                <div className={styles['impact-value']}>
                                                    {data.LowOpen}
                                                </div>
                                            </div>
                                        </Card>
                                    </Grid>
                                </Grid>
                                {/* Responsibility Open with cards */}
                                <Grid
                                    className={styles['problemlog-total-container']}
                                    container
                                    item={true}
                                >
                                    <Grid 
                                        className={styles['problemlog-total']}
                                        item xs={12}
                                    >
                                    <span>{`${subTitle[4]} : `}</span>
                                    <span className={styles['problemlog-value']}>{data.TotalAging}</span>
                                    </Grid>
                                </Grid>
                                <Grid 
                                    className={styles['problemlog-priority-container']}
                                    container
                                    spacing={1}
                                >
                                    {/* Mapping data aging */}
                                    <Grid 
                                        className={styles['problemlog-priority']}
                                        item xs={4}
                                    >
                                        <Card
                                            className={styles['card-impact-type']}
                                        >
                                            <div className={styles['impact-type']}>
                                                <div className={styles['impact-title']}>
                                                {subTitle[5]}
                                                </div>
                                                <div className={styles['impact-value']}>
                                                    {leftValue}
                                                </div>
                                            </div>
                                        </Card>
                                    </Grid>
                                    {/* Mapping data aging */}
                                    <Grid 
                                        className={styles['problemlog-priority']}
                                        item xs={4}
                                    >
                                        <Card
                                            className={styles['card-impact-type']}
                                        >
                                            <div className={styles['impact-type']}>
                                                <div className={styles['impact-title']}>
                                                    {subTitle[6]}
                                                </div>
                                                <div className={styles['impact-value']}>
                                                {midValue}
                                                </div>
                                            </div>
                                        </Card>
                                    </Grid>
                                    {/* Mapping data aging */}
                                    <Grid 
                                        className={styles['problemlog-priority']}
                                        item xs={4}
                                    >
                                        <Card
                                            className={styles['card-impact-type']}
                                        >
                                            <div className={styles['impact-type']}>
                                                <div className={styles['impact-title']}>
                                                    {subTitle[7]}
                                                </div>
                                                <div className={styles['impact-value']}>
                                                    {rightValue}
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
        )
    }
}