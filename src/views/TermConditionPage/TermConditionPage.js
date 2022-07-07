import React, { useEffect, useState } from "react";
import {
    Row, CardBody
} from 'reactstrap';
import './style/index.scss';
import Skeleton from 'react-loading-skeleton';
import Breadcrumb from "components/Breadcrumb/Breadcrumb";
import firebase from "../../firebase/firebase";
import { MENU } from "constants/menu";


const TermConditionPage = (props) => {
    const [isLoaded, setIsLoaded] = useState(false)

    const setAnalyticClevertap = (action, event, screen, product) => {
        if (props.user) {
            const { userName } = props.user;
            if (product !== null) {
                window.clevertapEventProduct(`${product[0] + "_LogedIn"}`, product[1]);
            } else {
                window.clevertapEvent(`${event + "_LogedIn"}`, props.user);
            }
            firebase.analytics().setUserId(userName);
            firebase.analytics().setUserProperties(userName, "username:" + userName + `||View: ${screen}`);
            firebase.analytics().setCurrentScreen(screen, screen);
            firebase.analytics().logEvent(`${event + "_LogedIn"}`);
            firebase.analytics().setUserProperties("username", userName);
            firebase.analytics().setUserProperties(action, `${event + "_LogedIn"}`);
        }
    };

    useEffect(() => {
        setAnalyticClevertap("view", "View_TermCondition_Screen", "View_TermCondition_Screen", null);
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        const { tokenResponse: { accessToken } } = props.user;
        async function fetchData() {
            const response = await props.fetchTermCondition(accessToken);
        }
        fetchData();
        if (props.dataTermCondition != undefined) {
            setIsLoaded(true);
        }
    }, []);

    const _renderTextTerm = (data) => {
        return (
            <td style={{ paddingLeft: '-1em' }}>{data.map((item) => {
                return (
                    <div style={{ paddingLeft: '-1em', paddingTop: '0.5em', whiteSpace: 'pre-wrap' }} className="contentParagraph">{item.content}</div>
                )
            })}
            </td>

        )
    }

    const _renderBreadCrumps = () => {
        const breadcrumps = [
            {
                'url': MENU.HOME,
                'name': 'Part Online Transaction'
            }
        ];
        return (
            <Breadcrumb
                linkBreadcrumb={breadcrumps}
                typography={"Syarat & Ketentuan"}
            />
        )
    };

    return (
        <Row className="bgTC">
            <CardBody className="bgContainerTC">
                <div style={{ marginBottom: '1rem' }}>
                    {_renderBreadCrumps()}
                </div>
                <div style={{ textAlign: 'left' }}>
                    <h2 style={{ color: '#D2B520' }} className="tncHeader1"><strong>Syarat dan Ketentuan</strong></h2>
                </div>
                {props.dataTermCondition != undefined ?
                    props.dataTermCondition.termAndConditionHeader != null ?
                        props.dataTermCondition.termAndConditionHeader.map((item) => {
                            return (
                                <>
                                    {item.title != "PEMBUKAAN" ?
                                        <table style={{ marginTop: '2em' }}>
                                            <tr>
                                                <td className="tncHeader2">
                                                    {
                                                        isLoaded ?
                                                            <strong>{item.title}</strong> :
                                                            <Skeleton count={20} />
                                                    }
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="paddingContent">
                                                    {_renderTextTerm(item.termAndConditionDetail)}
                                                </td>
                                            </tr>

                                        </table>
                                        :
                                        null}
                                </>
                            )
                        })
                        :
                        <div style={{ marginTop: '2em' }}>
                            <Skeleton count={1} />
                            <Skeleton count={30} />
                        </div>
                    :
                    null
                }
            </CardBody>
        </Row>
    )
};
export default TermConditionPage;