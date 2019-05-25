'use strict';

function titleClickHandler(event){
  event.preventDefault();

  const activeLinks = document.querySelectorAll('.titles a.active'),
  		clickedElement = this;

  for(let activeLink of activeLinks){
    activeLink.classList.remove('active');
  }
  clickedElement.classList.add('active');

  const activeArticles = document.querySelectorAll('.posts .post');

  for(let activeArticle of activeArticles){
    activeArticle.classList.remove('active');
  }

  let linkHref = clickedElement.getAttribute('href').slice(1),
  		selectedArticle = document.getElementById(linkHref);
  selectedArticle.classList.add('active');
}

const optArticleSelector = '.post',
			optTitleSelector = '.post-title',
			optTitleListSelector = '.titles';

function generateTitleLinks(){

	const titleList = document.querySelector(optTitleListSelector);
	titleList.innerHTML = '';

	const articles = document.querySelectorAll(optArticleSelector);

	let html = '';

	for(let article of articles){
	  const articleId = article.getAttribute('id'),
	  			articleTitle = article.querySelector(optTitleSelector).innerHTML,
	  			linkHTML = '<li><a href="#' + articleId + '"><span>' + articleTitle + '</span></a></li>';
	  html = html + linkHTML;
	}

	titleList.innerHTML = html;

	const links = document.querySelectorAll('.titles a');

	for(let link of links){
	  link.addEventListener('click', titleClickHandler);
	}
}
generateTitleLinks();