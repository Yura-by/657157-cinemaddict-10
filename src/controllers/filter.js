import FilterComponent from '../components/site-filter.js';
import {Filter, RenderPosition} from '../const.js';
import {getMoviesByFilter} from '../utils/filter.js';
import {replace, render} from '../utils/render.js';

export default class FilterController {
  constructor(container, moviesModel) {
    this._container = container;
    this._moviesModel = moviesModel;

    this._activeFilterType = Filter.ALL;
    this._filterComponent = null;

    this._onFilterChange = this._onFilterChange.bind(this);
    this._onDataChange = this._onDataChange.bind(this);

    this._moviesModel.setDataChangeHandler(this._onDataChange);
  }

  render() {
    const container = this._container;
    const allMovies = this._moviesModel.getAllMovies();
    const filters = Object.values(Filter).map((filterName) => {
      return {
        name: filterName,
        count: getMoviesByFilter(allMovies, filterName).length,
        checked: this._activeFilterType
      };
    });

    const oldFilterComponent = this._filterComponent;

    this._filterComponent = new FilterComponent(filters);
    this._filterComponent.setFilterChangeHandler(this._onFilterChange);

    if (oldFilterComponent) {
      replace(this._filterComponent, oldFilterComponent);
    } else {
      render(container, this._filterComponent, RenderPosition.AFTERBEGIN);
    }
  }

  _onFilterChange(filterType) {
    this._moviesModel.setFilter(filterType);
    this._activeFilterType = filterType;
  }

  _onDataChange() {
    this.render();
  }
}
