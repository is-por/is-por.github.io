// ==UserScript==
// @name         Bluecheck Remover
// @namespace    https://gist.github.com/is-por/02b7ef02fb9d67b1576f0d8c1e76d5ef/
// @version      0.15
// @description  Script to hide any post from blue check accounts that appear in the timeline
// @author       Erissm - @eris.wtf
// @match        *://*.twitter.com/*
// @match        *://*.x.com/*
// @icon         https://www.eris.wtf/media/newlogo.png
// @grant        none
// @updateURL    https://gist.githubusercontent.com/is-por/02b7ef02fb9d67b1576f0d8c1e76d5ef/raw
// @downloadURL  https://gist.githubusercontent.com/is-por/02b7ef02fb9d67b1576f0d8c1e76d5ef/raw
// ==/UserScript==

/**  tw-bluecheck-remover.js  **/
/**
Instructions:
-Import the script into any user manager extension (TamperMonkey, ViolentMokey, GreaseMonkey...)
-Add below any account you want to whitelist
-Enjoy :)
**/

//Write here the handle of any account whose posts you don't want to hide, even if they have blue check. Save the script after making any change.
const whitelistedAccts = []; //Fill the list like this: ['@exampleAccount1', '@exampleAccount2', ...];



/** BLUECHECK REMOVER SCRIPT v0.15 **/
//Filter to identify qrts
const quoteFilter = '.css-175oi2r.r-adacv.r-1udh08x.r-18bvks7.r-1867qdf.r-rs99b7.r-o7ynqc.r-6416eg.r-1ny4l3l.r-1loqt21';

//Toggle visibility of a post
function togglePost(e)
{
    let target = e.target.closest('button').parentElement;
    let tweet = target.querySelector('[data-bcnuke="bcnuke-post"]');

    if(tweet.style.display == "none"){
        tweet.style.display = "block";
        e.target.innerHTML = "[Hide]";
    }else{
        tweet.style.display = "none";
        e.target.innerHTML = "[Show]";
    }
}

function hideBlueCheck(elm) {

    //Get username of account
    let username = elm.closest('[data-testid="User-Name"]');
    let profile = Array.from(username.querySelectorAll('span')).find(el => el.textContent.startsWith("@")).textContent;
    sc.log("Bluecheck detected: "+profile);

    //If the account is whitelisted, ignore
    if(whitelistedAccts.includes(profile) ) return;

    //Get post or qrt block of the bluecheck
    let tweet = username.closest(quoteFilter);
    let isQuote = true;

    if(tweet == null){
        tweet = username.closest('[data-testid="tweet"]');
        isQuote = false;
    }

    let parent = tweet.parentElement;

    //If the post has already been hidden, ignore (in some cases the same post can be pulled by the script multiple times)
    if(parent.querySelector('.bcnuke-message') != null) return;

    //Add message and button to toggle visibility of the post
    let message = document.createElement('button');
    message.setAttribute("disabled", "");
    message.innerHTML = '<i class="bcnuke-message'+(isQuote?'':' r-1c7gwzm') +'" style="color:rgb(139, 152, 165)">Blue check '+(isQuote?'quote':'post') +' from '+profile+'. </i>';

    let toggle = document.createElement('span');
    toggle.innerHTML = "[Show]";
    toggle.style.color = "rgb(120, 86, 255)";
    toggle.style.cursor = "pointer";
    toggle.addEventListener("click", togglePost);

    message.appendChild(toggle);

    //Hide post block
    tweet.dataset.bcnuke = "bcnuke-post";
    tweet.style.display = "none";

    parent.insertBefore(message, parent.firstChild);

}


function blueCheckHandler(mutations) {
  try {
    for (let mutation of mutations) {
      for (let elem of mutation.addedNodes) {
        if(typeof elem === 'object' && elem !== null && 'querySelectorAll' in elem)
        {
            //Find bluechecks
            let bluechecks = elem.querySelectorAll('[data-testid="icon-verified"]');

            for (let bcheck of bluechecks)
            {
                hideBlueCheck(bcheck);
            }
        }
      }
    }
  } catch(e) {sc.log(e)}
}

//Logger
const sc = {
  log: (...args) => {
    console.log('[Bluecheck Remover]', ...args)
  }
}

const observer = new MutationObserver(blueCheckHandler)
observer.observe(document, { childList: true, subtree: true });
