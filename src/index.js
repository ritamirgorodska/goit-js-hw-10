import './css/styles.css';
import Notiflix from 'notiflix';
import 'lodash.debounce';
import { fetchCountries } from './fetchCountries';
import debounce from 'lodash.debounce';

const DEBOUNCE_DELAY = 300;

const inputElement = document.querySelector('#search-box');
const listCountry = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

inputElement.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput(e) {
  let query = inputElement.value.trim();
  // console.log(query)
  e.preventDefault();
  if (query === '') {
    listCountry.innerHTML = '';
    countryInfo.innerHTML = '';
  }

  fetchCountries(query).then(countries => {
    const [{ name, flags, capital, population, languages }] = countries;
    countryInfo.innerHTML = '';
    if (countries.length === 1) {
      createCountries(name, flags, capital, population, languages);
      listCountry.innerHTML = '';
    } else {
      renderCountryCard(countries);
    }

    if (countries.length >= 10) {
      Notiflix.Notify.info(
        'Too many matches found. Please enter a more specific name.'
      );
      listCountry.innerHTML = '';
      countryInfo.innerHTML = '';
    }
  });
}

function createCountries(name, flags, capital, population, languages) {
  return (countryInfo.innerHTML = `<div class='card-wrap'><img src='${
    flags.svg
  }' alt='${name.common}' width='30' height='33'>
    <h1 class='titleCountry'> ${name.common}</h1></div>
    <p class='text'><span class='text-info'>Capital: </span>${capital}</p>
    <p class='text'><span class='text-info'>Population: </span>${population}</p>
    <p class='text'><span class='text-info'>Languages: </span>${Object.values(
      languages
    )}</p>`);
}

function renderCountryCard(countries) {
  const [{ name, flags, capital, population, languages }] = countries;
  listCountry.innerHTML = '';

  const countryEl = countries
    .map(({ name, flags }) => {
      return `<li class='Country-item'><img src='${flags.svg}' alt='${name.common}' width='30' height='33'>
        <p class='item-text'>${name.common}</p></li>`;
    })
    .join('');
  listCountry.insertAdjacentHTML('beforeend', countryEl);
}
