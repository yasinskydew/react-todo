import React, { Component } from 'react';

import AppHeader from '../app-header';
import SearchPanel from '../search-panel';
import TodoList from '../todo-list';
import ItemStatusFilter from '../item-status-filter';
import AddItem from '../add-item'

import './app.css';

export default class extends Component {

  maxId = 100;

  state = {
    todoData: [
      this.createTodoItem('Drink Coffee'),
      this.createTodoItem('Make Awesome App'),
      this.createTodoItem('Have a lunch')
    ],
    term: "",
    filter: 'all' // all, active,  done
  }

  createTodoItem(label) {
    return {
      label,
        important: false,
        done:false,
        id: this.maxId++
    }
  }

  addItem = (text) => {
  
    this.setState(({ todoData }) => {
      const newItem = this.createTodoItem(text)
      const newArray = todoData.slice(0)
      newArray.push(newItem)
    return {
      todoData: newArray
    }
    })
  }

  deleteItem = (id) => {
    this.setState(({todoData}) => {
      const idx = todoData.findIndex((el) => el.id === id)
      
      const newArray = [
        ...todoData.slice(0, idx), 
        ...todoData.slice(idx + 1)]
      return {
        todoData: newArray
      }
    })
  }

  toggleProperty(arr, id, propName){
      const idx = arr.findIndex((el) => el.id === id)
      const olditem = arr[idx]
      const newItem = { ...olditem, [propName]: !olditem[propName]}

      return [
        ...arr.slice(0, idx), 
        newItem,
        ...arr.slice(idx + 1)
      ]
  }

  onToggleDone = (id) => {
    this.setState(({ todoData }) => {
      return {
        todoData: this.toggleProperty(todoData, id, 'done')
      }
    })
  }

  onToggleImportant = (id) => {
    this.setState(({ todoData }) => {
      return {
        todoData: this.toggleProperty(todoData, id, 'important')
      }
    })
  }

  onSearchChange = (term) => {
    this.setState( {term} )
  }

  onFilterChange = (filter) => {
    this.setState( {filter} )
  }   
  
  search(items, term) {
    if(term.length === 0){
      return items
    }
   return items.filter((item) => {
      return item.label.toLowerCase().indexOf(term.toLowerCase()) > -1
    })
  }

  filter(items, filter) {
    switch(filter) {
      case 'all':
        return items;
      case 'active':
        return items.filter((item) => !item.done)
      case 'done':
        return items.filter((item) => item.done)
      default:
        return items
    }
  }
  


  render(){
    const {todoData, term, filter} = this.state

    const visibleItems = this.filter(this.search(todoData, term), filter)

    const doneCount = todoData.filter((el) => el.done) 
    const todoCount = todoData.length - doneCount.length

    return (
      <div className="todo-app">
        <AppHeader toDo={todoCount} done={doneCount.length} />
        <div className="top-panel d-flex">
          <SearchPanel 
            onSearchChange = { this.onSearchChange }/>
          <ItemStatusFilter 
            filter ={filter}
            onFilterChange = {this.onFilterChange}/>
        </div>

        <TodoList 
          todos={visibleItems}
          onDeleted = { this.deleteItem }
          onToggleDone = { this.onToggleDone }
          onToggleImportant = { this.onToggleImportant }
        />
        <AddItem 
          onAdded = { this.addItem }
        />
      </div>
    );
  }
}