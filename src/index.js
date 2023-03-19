import './css/styles.css';
import debounce from 'lodash.debounce';
import { fetchCountries } from './fetchCountries';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;
const refs = {
  input: document.querySelector('#search-box'),
  list: document.querySelector('.country-list'),
  info: document.querySelector('.country-info'),
};

refs.input.addEventListener('input', debounce(onInputChange, DEBOUNCE_DELAY));

function onInputChange(event) {
  const search = event.target.value.trim();
    refs.list.innerHTML = '';
    refs.info.innerHTML = '';

  if (search !== '') {
    fetchCountries(search)
      .then(data => {
        switch (true) {
          case data.length > 10:
            Notiflix.Notify.info(
              'Too many matches found. Please enter a more specific name.'
            );
            break;
          case data.length >= 2 && data.length <= 10:
            createCountriesList(data);
            break;
          case data.length === 1:
            createCountryDetails(data);
            break;
          case data !== 0:
            Notiflix.Notify.failure('Oops, there is no country with that name');
            break;
          default:
            break;
        }
      })
      .catch(error => {
        console.log('error', error);
      });
  }
}

function createCountriesList(countries) {
  const countriesList = countries
    .map(country => {
      return `<li class="list-item">
    <img src="${country.flags.svg}" alt="Flag of ${country.name.official}" width="40" hight="20">
    <span>${country.name.official}</span></li>`;
    })
    .join('');

  refs.list.insertAdjacentHTML('beforeend', countriesList);
}

function createCountryDetails(countries) {
  const countryInfo = countries
    .map(country => {
      return `<img
          src="${country.flags.svg}"
          alt="Flag of ${country.name.official}"
          width="60"
          hight="40"
        />
        <p class="country-name">${country.name.official}</p>
        <p><span class="country-des">Capital:</span> ${country.capital}</p>
        <p><span class="country-des">Population:</span> ${
          country.population
        }</p>
        <p><span class="country-des">Languages:</span> ${Object.values(
          country.languages
        )}</p>`;
    })
    .join('');

  refs.info.innerHTML = countryInfo;
}
