import React from 'react';
import { 
    ExpansionPanel, 
    ExpansionPanelSummary, 
    ExpansionPanelDetails 
} from '@material-ui/core';
import { ExpandMore } from '@material-ui/icons';
import CollapseList from './CollapseList/CollapseList';
import './CollapseGroup.scss'

export default class CollapseGroup extends React.PureComponent {
    updateFormValue = (newData) => {
        this.props.updatePiForm(newData);
    }
    render(){
        const {AreaCheckSheets} = this.props;
        return(
            <div className='checklist-group-container'>
                {
                    AreaCheckSheets.map((field) => (
                    <ExpansionPanel classes={{root:'checklist-group-expand'}}>
                    <ExpansionPanelSummary
                        expandIcon={<ExpandMore />} 
                        classes={{ 
                            expanded: 'checklist-group-header-icon', 
                            root: 'checklist-group-header-expanded', 
                            content: 'checklist-group-header-expanded' 
                            }}
                    >
                    <p className='checklist-group-title'>{field.Area}</p>
                    <div className='checklist-group-summary'>
                        <span className='green'>{field.GoodCondition}</span>
                        {'/'}
                        <span className='red'>{field.BadCondition}</span>
                        {'/'}
                        <span className='yellow'>{field.UncheckCondition}</span>
                    </div>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails classes={{root:'checklist-group-detail'}}>
                        {
                            field.CheckSheetValues.map((element) => (
                                <CollapseList
                                    {...this.props}
                                    key={element.Sequence}
                                    CheckSheetValues={element}
                                    updateFormValue = {this.updateFormValue}
                                />
                            ))
                        }
                    </ExpansionPanelDetails>
                    </ExpansionPanel>
                    ))
                }
                
            </div>
        )
    }
}