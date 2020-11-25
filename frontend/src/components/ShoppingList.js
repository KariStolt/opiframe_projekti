import React from 'react';
import {Table,Button} from 'semantic-ui-react';
import Row from './Row';
import RemoveRow from './RemoveRow';
import EditRow from './EditRow';

export default class ShoppingList extends React.Component {
	
	constructor(props) {
		super(props);
		this.state = {
			removeIndex:-1,
			editIndex:-1
		}
	}
	
	cancel = () => {
		this.setState({
			removeIndex:-1,
			editIndex:-1
		})
	}
	
	removeFromList = (id) => {
		this.props.removeFromList(id);
		this.cancel();
	}
	
	editItem = (item) => {
		this.props.editItem(item);
		this.cancel();
	}
	
	changeToRemoveMode = (id) => {
		for(let i=0;i<this.props.list.length;i++) {
			if(id === this.props.list[i]._id) {
				this.setState({
					removeIndex:i,
					editIndex:-1
				})
			}
		}
	}

	changeToEditMode = (id) => {
		for(let i=0;i<this.props.list.length;i++) {
			if(id === this.props.list[i]._id) {
				this.setState({
					removeIndex:-1,
					editIndex:i
				})
			}
		}
	}

	
	render() {
		let items = this.props.list.map((item,index) => {
			if(this.state.editIndex === index) {
				return(
					<EditRow key={item._id} item={item}
							cancel={this.cancel} editItem={this.editItem}/>
				)
			}
			if(this.state.removeIndex === index) {
				return (
				<RemoveRow key={item._id} item={item} 
				cancel={this.cancel} removeFromList={this.removeFromList}/>
				)
			}
			return (
				<Row key={item._id} item={item} changeToRemoveMode={this.changeToRemoveMode}
					changeToEditMode={this.changeToEditMode}/>
				)
 		})
		return (
			<Table>
				<Table.Header>
					<Table.Row>
						<Table.HeaderCell>Type</Table.HeaderCell>
						<Table.HeaderCell>Count</Table.HeaderCell>
						<Table.HeaderCell>Price</Table.HeaderCell>
						<Table.HeaderCell>Creator</Table.HeaderCell>
						<Table.HeaderCell>Shared with</Table.HeaderCell>
						<Table.HeaderCell>Remove</Table.HeaderCell>
						<Table.HeaderCell>Edit</Table.HeaderCell>
					</Table.Row>
				</Table.Header>
				<Table.Body>
				{items}
				</Table.Body>
			</Table>
		)
		
	}
}