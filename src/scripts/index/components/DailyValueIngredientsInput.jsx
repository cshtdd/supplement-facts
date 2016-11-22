import React from 'react'
import Select from 'react-select'
import DailyValueIngredientsDataService from '../lib/DailyValueIngredientsDataService.jsx'

export default class DailyValueIngredientsInput extends React.Component {
    constructor(props){
        super(props)

        //**** dependencies ****
        this._dailyValueIngredientsDataService = props["DailyValueIngredientsDataService"] || new DailyValueIngredientsDataService()

        //**** initial state ****
        this.state = this._getDefaultState()

        //**** event handlers *****
        this._handleTextChanged = this._handleTextChanged.bind(this)
        this._handleSelectChanged = this._handleSelectChanged.bind(this)
        this._handleAddButtonClick = this._handleAddButtonClick.bind(this)
    }

    _getDefaultState(){
        return {
            dvIngredientName: "",
            dvIngredientSource: "",
            dvIngredientQuantity: ""
        }
    }

    _handleTextChanged(propertyName){
        var that = this

        return (event) => {
            var stateChange = {}
            stateChange[propertyName] = event.target.value
            that.setState(stateChange)
        }
    }

    _handleSelectChanged(propertyName){
        var that = this

        return (event) => {
            var stateChange = {}
            stateChange[propertyName] = event.value

            that.setState(stateChange)
        }
    }

    _broadcastChange(componentStatus){
        if (this.props.onChange){
            this.props.onChange(componentStatus)
        }
    }

    _ingredientsToSelectOptions(ingredients){
        return (ingredients || []).map(i => {
            return {value: i.name, label: i.name}
        })
    }

    _handleAddButtonClick(){
        var newIngredient = {
            name: this.state.dvIngredientName,
            source: this.state.dvIngredientSource,
            quantity: parseInt(this.state.dvIngredientQuantity || "0")
        }
        var updatedIngredients = (this.props.value || []).concat(newIngredient)

        this.setState(this._getDefaultState())
        this._broadcastChange(updatedIngredients)
    }

    _getIngredientUnit(ingredientName){
        var allIngredientPresets = this._dailyValueIngredientsDataService.all()
        var result = allIngredientPresets.find(p => p.name === ingredientName).unit
        return result
    }

    render (){
        return (
            <div>
                <ul className="list-group">
                    { 
                        (this.props.value || []).map((i, idx) => <li className="list-group-item" key={idx}>
                              <span>
                                {i.name} {i.source} 
                                <span className="badge">
                                    {i.quantity} {this._getIngredientUnit(i.name)}
                                </span>
                              </span>

                              <span className="pull-right">
                                <a href="#" onClick="">x</a>
                              </span>
                            </li>
                        ) 
                    }
                </ul>

                    <Select 
                        name="dvIngredientName"
                        clearable={false}
                        options={this._ingredientsToSelectOptions(this._dailyValueIngredientsDataService.all())}
                        value={this.state.dvIngredientName}
                        onChange={this._handleSelectChanged("dvIngredientName")} />

                    <input 
                        name="dvIngredientSource"
                        type="text"
                        className="form-control"
                        placeholder="Source"
                        value={this.state.dvIngredientSource}
                        onChange={this._handleTextChanged("dvIngredientSource")} />

                <div className="input-group">
                    <input 
                        name="dvIngredientQuantity"
                        type="text"
                        className="form-control"
                        placeholder="Quantity"
                        value={this.state.dvIngredientQuantity}
                        onChange={this._handleTextChanged("dvIngredientQuantity")} />

                    <span className="input-group-addon">mg</span>

                    <span className="input-group-btn">
                        <button
                            className="btn btn-primary"
                            type="button"
                            onClick={this._handleAddButtonClick}>
                            Add
                        </button>
                    </span>
                </div>
            </div>
        )
    }
}