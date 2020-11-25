import React from 'react';
import {Form,Button} from 'semantic-ui-react';

export default class ShoppingForm extends React.Component {
	
	constructor(props) {
		super(props);
		this.state = {
			type:"",
			count:0,
			price:0,
			shared:""
		}
	}
	
	onChange = (event) => {
		let state = {};
		state[event.target.name] = event.target.value;
		this.setState(state);
	}
	
	onSubmit = (event) => {
		event.preventDefault();
		let item = {
			id:0,
			type:this.state.type,
			count:this.state.count,
			price:this.state.price,
			shared:this.state.shared
		}
		this.props.addToList(item);
		this.setState({
			type:"",
			count:0,
			price:0,
			shared:""
		})
	}
	
	render() {
		return(
			<Form onSubmit={this.onSubmit}>
				<Form.Field>
					<label htmlFor="type">Type:</label>
					<input type="text"
							name="type"
							onChange={this.onChange}
							value={this.state.type}/>
				</Form.Field>
				<Form.Field>
					<label htmlFor="count">Count:</label>
					<input type="number"
							name="count"
							onChange={this.onChange}
							value={this.state.count}/>
				</Form.Field>
				<Form.Field>
					<label htmlFor="price">Price:</label>
					<input type="number"
							name="price"
							step="0.01"
							onChange={this.onChange}
							value={this.state.price}/>
				</Form.Field>
				<Form.Field>
					<label htmlFor="shared">Share with:</label>
					<input type="text"
							name="shared"
							onChange={this.onChange}
							value={this.state.shared}/>
				</Form.Field>
				<Button type="submit" color="red">Add</Button>
			</Form>
		)
	}
}