import React from 'react';
import {Table,Button} from 'semantic-ui-react';

export default class EditRow extends React.Component {
	
	constructor(props) {
		super(props);
		this.state = {
			type:props.item.type,
			count:props.item.count,
			price:props.item.price,
			currentuser:props.item.currentuser,
			shared:props.item.shared
			
		}
	}
	
	onChange = (event) => {
		let state = {};
		state[event.target.name] = event.target.value;
		this.setState(state);
	}

	editItem = (event) => {
		let item = {
			_id:this.props.item._id,
			type:this.state.type,
			count:this.state.count,
			price:this.state.price,
			currentuser:this.state.currentuser,
			shared:this.state.shared
		}
		this.props.editItem(item);
	}
	
	render() {
		return(
			<Table.Row>
				<Table.Cell><input type="text"
								name="type"
								onChange={this.onChange}
								value={this.state.type}/></Table.Cell>
				<Table.Cell><input type="number"
								name="count"
								onChange={this.onChange}
								value={this.state.count}/></Table.Cell>
				<Table.Cell><input type="number"
								name="price"
								step="0.01"
								onChange={this.onChange}
								value={this.state.price}/></Table.Cell>
				<Table.Cell><input type="text"
								name="currentuser"
								onChange={this.onChange}
								value={this.state.currentuser}/></Table.Cell>
				<Table.Cell><input type="text"
								name="shared"
								onChange={this.onChange}
								value={this.state.shared}/></Table.Cell>
				<Table.Cell><Button onClick={()=> this.editItem()} color="green">
							Save</Button></Table.Cell>
				<Table.Cell><Button onClick={()=> this.props.cancel()} color="red">
							Cancel</Button></Table.Cell>
			</Table.Row>
		)
	}
}