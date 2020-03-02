import React from 'react';
import './Nutrition.css';

/*class Form extends React.Component{

    render(){
        return(
            <form ref="form">
                <input type = "text" ref = "title" placeholder = "Title of your recipe"></input>
                <input type = "number" ref = "servings" placeholder = "# of servings"></input>
                <button>Submit</button>
            </form>
        );
    }
}*/

class IngredientForm extends React.Component{
    constructor(props){
        super(props);
        this.onSubmit = this.onSubmit.bind(this);
    }

    onSubmit(event){
        event.preventDefault();
        this.props.addIngredient(this.refs.amount.value + " " + this.refs.measurement.value + " " + this.refs.name.value);
        this.refs.form.reset();
    }
    
    render(){
        return(
            <form ref="form" onSubmit={this.onSubmit}>
                <input type="number" min="0" ref="amount" required></input>
                <select ref="measurement">
                    <option value="g">g</option>
                    <option value="kg">kg</option>
                    <option value="ml">ml</option>
                    <option value="l">l</option>
                </select>
                <input type="text" ref="name" placeholder="Of what?" required></input>
                <button type="submit">Add</button>
            </form>
        );
    }
}

class Nutrition extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            title: '',
            ingredients: [],
            totalCalories: 0,
            fat: 0,
            protein: 0,
            carbs: 0
        }
        this.addIngredient = this.addIngredient.bind(this);
        this.removeIngredient = this.removeIngredient.bind(this);
    }

    addIngredient(ingredient){
        fetch('https://api.edamam.com/api/food-database/parser?app_id=c8078a47&app_key=b0132f85f4308d30ea521c2412461ec9&ingr="' + ingredient).then((results) => results.json()).then((data) => {
            this.setState({totalCalories: this.state.totalCalories + Math.round(data.parsed[0].food.nutrients.ENERC_KCAL),
                carbs: this.state.carbs + Math.round(data.parsed[0].food.nutrients.CHOCDF),
                fat: this.state.fat + Math.round(data.parsed[0].food.nutrients.FAT),
                protein: this.state.protein + Math.round(data.parsed[0].food.nutrients.PROCNT) });
        });

        this.setState(
            {ingredients: [...this.state.ingredients, ingredient]}
        );
    }

    removeIngredient(index){
        const ingredient = this.state.ingredients[index];
        fetch('https://api.edamam.com/api/food-database/parser?app_id=c8078a47&app_key=b0132f85f4308d30ea521c2412461ec9&ingr="' + ingredient).then((results) => results.json()).then((data) => {
            this.setState({totalCalories: this.state.totalCalories - Math.round(data.parsed[0].food.nutrients.ENERC_KCAL),
            carbs: this.state.carbs - Math.round(data.parsed[0].food.nutrients.CHOCDF),
            fat: this.state.fat - Math.round(data.parsed[0].food.nutrients.FAT),
            protein: this.state.protein - Math.round(data.parsed[0].food.nutrients.PROCNT) });
        });

        this.setState(
            {ingredients: [...this.state.ingredients.slice(0,index), ...this.state.ingredients.slice(index+1)]}
        );
    }

    render(){
        return(
            <div className = "nutrition">
                <div className = "column">
                    <IngredientForm addIngredient={this.addIngredient}/>
                    <p><b>Calories:</b> {this.state.totalCalories} kcal</p>
                    <p><b>Carbs:</b> {this.state.carbs} g</p>
                    <p><b>Fat:</b> {this.state.fat} g</p>
                    <p><b>Protein:</b> {this.state.protein} g</p>
                </div>
                <div className = "column right">
                    <ul>
                        {this.state.ingredients.map((ingredient, i) => <li><button onClick={() => this.removeIngredient(i)}>x</button>{ingredient}</li>)}
                    </ul>
                </div>
            </div>
        );
    }
}

export default Nutrition;