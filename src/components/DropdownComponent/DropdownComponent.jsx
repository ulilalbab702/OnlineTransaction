import React from 'react';
import {ExpandMore} from '@material-ui/icons';
import './DropdownComponent.scss';

export default class DropdownComponent extends React.Component {
    constructor(props){
        super(props);
        this.state={
            isShowMenu:false,
        }
    }
    _handleJobType = (item,itemKeys) => {
        if(typeof item ==='string'){
            let newItem = item
            if(item === 'INS'){
                newItem = 'Periodic Inspection'
                }
            return newItem
        } else {
            if(itemKeys) return item[itemKeys]
        }
        if(item.Name) return item.Name
    }
    
    _showDropdownMenu = (event) => {
        event.preventDefault();
        this.setState({
            isShowMenu:true,
           },
           () => {document.addEventListener('click',this._hideDropdownMenu);
        });
    }
    
    _hideDropdownMenu = () => {
        this.setState({
            isShowMenu:false
            },
            () => {document.removeEventListener('click',this._hideDropdownMenu);
        });
    }

    selectItem = (item) => {
        let newItem = item
        if(item === 'Periodic Inspection'){
        newItem = 'INS'
            return this.props.onSelectAction(newItem);
        }
        if (item.Name) return this.props.onSelectAction(item.Name)
        return this.props.onSelectAction(newItem);   
    }
    renderDropdownList = () => {
    return (
        <ul className="list-items">
            {this.props.data
            && this.props.data.map((item, index) => (item && 
            <div className="list-item" onClick={() => this.selectItem(item)} key={index}>
                {this._handleJobType(item,this.props.itemKey)}
            </div>
            ))}
        </ul>
        );
    }
    _renderDropdown = () => {
        return (
            <div 
                className='dropdown-button'
                onClick={this._showDropdownMenu}
            >
                <div className='dropdown-selected-item'>
                    {this.props.selected}
                    <div className='expand-icon-container'>
                        <ExpandMore className='expand-icon'/>
                    </div>
                </div>
            </div>
        )
    }
    _renderDropdownMobile = () => {
        return (
            <>
            <div className='dropdown'>
                {this._renderDropdown()}
                {this.state.displayMenu && this._renderDropdownList()}
            </div>
            </>
        )
    }
    render(){
        const {displayMode} = this.props
        if (displayMode === 'mobile'){
            return (
                this._renderDropdownMobile()
            )
        }
        return (
            <div className='dropdown'>
                {this._renderDropdown()}
                {
                    this.state.isShowMenu && this.renderDropdownList()
                }
            </div>
        )
    }
}