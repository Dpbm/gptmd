(() => {
  if (window.hasRun) {
		return;
	}
	window.hasRun = true;

  browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
    const title = document.title;
    
    const queryData = [...document.querySelectorAll("div.flex.flex-grow.gap-3")];
    const text = queryData.map((query) => query.innerText);

    sendResponse({
      response: {
        title,
        text
      }
    });
  });

})();
