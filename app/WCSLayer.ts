// To make TypeScript stop infering and
// complaining about undeclared variable.
// Imported globally with a normal script tag
declare var Tiff: any;

const getTile = (url: string) => {
  const promise = new Promise((resolve, reject) => {
    var xhrRequest = new XMLHttpRequest();

    xhrRequest.open("GET", url, true);
    xhrRequest.responseType = "arraybuffer";

    xhrRequest.onreadystatechange = function() {
      if (xhrRequest.readyState === 4) {
        // request is done

        if (xhrRequest.status === 200) {
          resolve(xhrRequest.response);
        }

        reject(xhrRequest.responseText);
      }
    };

    xhrRequest.send();
  });

  return promise;
};

class WCSLayer {
  private tileSpanX: number;
  private tileSpanY: number;

  private wcsWidth: number;
  private wcsHeight: number;

  constructor() {
    // TODO accept url
  }
}

export default WCSLayer;
