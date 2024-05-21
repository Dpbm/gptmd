(() => {
  if (window.hasRun)
		return;
	window.hasRun = true;

  browser.runtime.onMessage.addListener((_request, _sender, sendResponse) => {
    const title = document?.title || new Date().toString();

    const textElementsSelector = 'div.text-message';
    const text = Array.from(document.querySelectorAll(textElementsSelector))
                      .map((element) => element?.innerText ?? '');


    if(text.length <= 0)
      throw new Error('No converstaion was found!');

    sendResponse({
      response: {
        title,
        text
      }
    });
  });

})();
