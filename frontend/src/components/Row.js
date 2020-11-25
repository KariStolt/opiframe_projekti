import React from 'react';
import {Table,Button} from 'semantic-ui-react';

export default class Row extends React.Component {

	render() {
		return (
			<Table.Row>
				<Table.Cell>{this.props.item.type}</Table.Cell>	
				<Table.Cell>{this.props.item.count}</Table.Cell>
				<Table.Cell>{this.props.item.price}</Table.Cell>
				<Table.Cell>{this.props.item.currentuser}</Table.Cell>
				<Table.Cell>{this.props.item.shared}</Table.Cell>
				<Table.Cell><Button color="blue"
					onClick={() => this.props.changeToRemoveMode(this.props.item._id)}>
					Remove</Button></Table.Cell>
				<Table.Cell><Button color="green"
					onClick={() => this.props.changeToEditMode(this.props.item._id)}>
				Edit</Button></Table.Cell>
			</Table.Row>	
		
		)
	}
}