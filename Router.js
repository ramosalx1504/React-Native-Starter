import {ViewExceptions} from './exceptions/RouterExceptions.js';

export default
class Router
{
	static setNavigator(nav)
	{
		navigator = nav;
	}


	static index()
	{
		return findView('index');
	}

	static all()
	{
		return mapper;
	}


	static register(data){
		mapper = data;
	}

	static setActiveRoute(route){
		activeRoute = route;
	}

	static getCurrentView(){
		return activeRoute.name;
	}


	/**
	* Monta view previamente registrada en el navigator sin desmontar
	* el view, adicionalmente si el view no se encuentra en el stack lo agrega
	*/
	static jumpTo(name, params={})
	{
		willDisappearCallback();

		if(viewNotInStack(name)) return this.openView(name, params);

		view = findView(name);
		view['_params'] = Object.assign({}, params);
		navigator.jumpTo(view);
	}


	/**
	* Monta view y reinicia el stack iniciando con dicha ruta 
	*
	*/
	static jumpAndReset(name, params={})
	{
		willDisappearCallback();

		view = findView(name);
		view['_params'] = Object.assign({}, params);
		navigator.resetTo(view);
	}


	/**
	* Crea o reinicia un view del stack, si el view ya se encuentra en el stack
	* se perdería la informacion existente
	*/
	static openView(name, params={})
	{
		willDisappearCallback();

		view = findView(name);
		view['_params'] = Object.assign({}, params);
		navigator.push(view);
	}


	/**
	* Retorna al view anterior sin desmontar el actual
	*/
	static jumpBack()
	{
		willDisappearCallback();

		navigator.jumpBack();
	}	


	/**
	* Regresa al view anterior desmontando el actual
	*/
	static closeView()
	{
		willDisappearCallback();

		navigator.pop();
	}


	/**
	 * Replaces current view
	 */
	static replace(name, params={})
	{
		willDisappearCallback();
		
		view = findView(name);
		view['_params'] = Object.assign({}, params);
		navigator.replace(view);
	}

	static setWillDisappearCallback(callback){
		willDisappearCallback = callback;
	}

	/**
	 *  Return active view stack
	 */
	static getStack()
	{
		console.log('getStack');
		return navigator.getCurrentRoutes();
	}
}

/**
* Busca un view en el mapper
*
* @author Felix Vasquez, Baum Digital
*/
function findView(name)
{
	var view = mapper.find(function(obj){
		return obj.name === name
	});
	
	if(typeof view == 'undefined') throw new ViewExceptions(`La vista especificada ('${name}') no se encuentra registrada en el mapper.`);
	
	return view;
}


/**
* Verifica si un view no se encuentra en el stack
*
* @author Felix Vasquez, Baum Digital
*/
function viewNotInStack(name)
{
	var view = navigator.getCurrentRoutes().find(function(obj){
		return obj.name === name
	});

	return typeof view === 'undefined';
}

var navigator;
var mapper;
var activeRoute;
var willDisappearCallback = function(){};