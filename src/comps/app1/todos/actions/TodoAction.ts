import {Injectable, Component, Injector, provide} from "angular2/core";
import {Actions, AppStore} from "angular2-redux-util";
import {TodoModel} from "../TodoModel";
import {StoreModel} from "../../../../models/StoreModel";
import {TodosService} from "../TodoService";
import {HTTP_PROVIDERS} from "angular2/http";
import TodoStatsModel from "../TodoStatsModel";

export const ADD_TODO = 'ADD_TODO';
export const REMOVE_TODO = 'REMOVE_TODO';
export const EDIT_TODO = 'EDIT_TODO';
export const CLEAR_TODOS = 'CLEAR_TODOS';

var bootbox = require('bootbox');

@Injectable()
export class TodoAction extends Actions {

    private service:TodosService;

    constructor(private appStore:AppStore) {
        super();
    }

    private factoryService(){
        if (this.service)
            return;
        var injector = Injector.resolveAndCreate(
            [
                TodosService,
                TodoAction,
                HTTP_PROVIDERS,
                TodoStatsModel,
                provide(AppStore, {useValue: this.appStore})
            ]);
        this.service = injector.get(TodosService);
    }

    public addTodo(task:string, id?:string) {
        this.factoryService();
        return (dispatch) => {
            let modelId = id || StoreModel.UniqueId();
            var todoModel:TodoModel = new TodoModel({task, modelId});
            this.service.saveTodoRemote(todoModel, (status:number)=> {
                if (status == -1) {
                    bootbox.alert('problem saving to server 1');
                    return;
                }
                //dispatch({type: ADD_TODO, todoModel: todoModel});
                dispatch(this.addTodoDispatch(todoModel));
            });
        }
    }

    public addTodoDispatch(todoModel:TodoModel) {
        return {type: ADD_TODO, todoModel: todoModel};
    }

    public clearTodoDispatch() {
        return {type: CLEAR_TODOS};
    }

    public removeTodo(todoModel:TodoModel) {
        this.factoryService();
        return (dispatch) => {
            this.service.removeTodoRemote(todoModel, (status:number)=> {
                if (status == -1) {
                    bootbox.alert('problem saving to server 2');
                    return;
                }
                dispatch(this.removeTodoDispatch(todoModel));
            });
        }
    }

    public removeTodoDispatch(todoModel:TodoModel) {
        return {type: REMOVE_TODO, modelId: todoModel.getKey('modelId')};
    }

    public editTodo(todoModel:TodoModel) {
        this.factoryService();
        return (dispatch) => {
            dispatch(this.editTodoDispatch(todoModel));
            this.service.editTodoRemote(todoModel, (status:number)=> {
                if (status == -1) {
                    bootbox.alert('problem saving to server 3');
                    return;
                }
            });
        }
    }

    public editTodoDispatch(todoModel:TodoModel) {
        return {type: EDIT_TODO, modelId: todoModel.getKey('modelId'), key: 'task', value: todoModel['task']};
    }

}
