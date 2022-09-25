import './css/styles.css';
import API from './js/fetchCountries';
import { debounce } from 'throttle-debounce';
import Notiflix from 'notiflix';
const DEBOUNCE_DELAY = 300;

const refs = {
	inputText: document.querySelector('#search-box'),
	countryList: document.querySelector('.country-list'),
	countryInfo: document.querySelector('.country-info'),
};
const { inputText, countryList, countryInfo } = refs;
inputText.addEventListener('input', debounce(DEBOUNCE_DELAY, onSearchInput));

function onSearchInput(evt) {
	if (evt.target.value.trim() === '') {
		return (countryInfo.innerHTML = ''), (countryList.innerHTML = '');
	}
	evt.preventDefault();

	return API.fetchСountries(evt.target.value.trim())
		.then(countries => {
			if (countries.length > 10) {
				countryList.innerHTML = '';
				Notiflix.Notify.info(
					'Too many matches found. Please enter a more specific name.'
				);
			} else if (countries.length === 1) {
				createCountryInfoMarkup(countries);
				countryList.innerHTML = '';
			} else if (countries.length < 10 && countries.length >= 2) {
				createCountriesMarkup(countries);
				countryInfo.innerHTML = '';
			}
		})
		.catch(error => {
			Notiflix.Notify.failure('Oops, there is no country with that name');
			return (countryInfo.innerHTML = ''), (countryList.innerHTML = '');
		});
}

function createCountriesMarkup(countries) {
	const markup = countries
		.map(country => {
			return `
			<li class = country-list__item>
			<img class = country-list__image src = ${country.flags.svg} width = 40 height = 30> </img>
			<span class = "country-name">${country.name.official}</span>
			</li>`;
		})
		.join('');
	countryList.innerHTML = markup;
}

function createCountryInfoMarkup(countries) {
	const markup = countries
		.map(({ flags, name, capital, population, languages }) => {
			return `
			<div class = "country-info">
			<img src = ${flags.svg} width = 40 height = 30> </img>
			<b class = "country-name">${name.official}</b>
			<p>Capital: <b> ${capital}</b></p>
			<p>Population:<b> ${population}</b></p>
			<p>Languages: <b> ${Object.values(languages)}</b></p>
			</div>
			`;
		})
		.join('');
	countryInfo.innerHTML = markup;
}