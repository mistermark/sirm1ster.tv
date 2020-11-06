//element.classList.add("mystyle");

(function() {
  let urlParams;

  var match,
    pl = /\+/g, // Regex for replacing addition symbol with a space
    search = /([^&=]+)=?([^&]*)/g,
    decode = function (s) {
      return decodeURIComponent(s.replace(pl, " "));
    },
    query = window.location.search.substring(1);

  urlParams = {};
  while ((match = search.exec(query)))
    urlParams[decode(match[1])] = decode(match[2]);


  // COMMON VARS

  const TILTIFY_TOKEN = urlParams['token'];
  const TILTIFY_CAMPAIGNID = urlParams['campaign'];
  const LIST_TITLE = urlParams['title'];

  const TILTIFY_API = {
    base: 'https://tiltify.com',
  };
  const API_OPTIONS = {
    'headers': {
      'Authorization': `Bearer ${TILTIFY_TOKEN}`
    }
  };

  const mockCampaign = {};

  // STORE

  const progressBarFill = document.getElementById('progress-fill-bar');
  // const campaignTitle = document.getElementById('title');

  // METHODS

  const _createElementFromHTML = (html) => {
    var template = document.createElement('template');
    html = html.trim();
    template.innerHTML = html;

    return template.content.firstChild;
  }

  const _fetchAPI = (url) => {
    return new Promise ((resolve, reject) => fetch(url, API_OPTIONS)
      .then((res) => {
        if(res.status !== 200) {
          throw new Error(`${res.status}: ${res.statusText}`);
        }
        return res.json();
      })
    );
  }

  const getTeamCampaign = () => {
    return _fetchAPI(`/teams/${TILTIFY_TEAMID}/campaigns`)
    .then((json) => {
      return json.data;
    })
  }

  const getCampaign = (url = `${TILTIFY_API.base}/api/v3/campaigns/${TILTIFY_CAMPAIGNID}`) => {
    return new Promise((resolve, reject) => fetch(url, API_OPTIONS)
      .then(response => {
        if(response.status !== 200) {
          throw `${response.status}: ${response.statusText}`;
        }
        response.json().then(data => {
          resolve(data.data);
        }).catch(reject);
      }).catch(reject))
  }

  const setProgressAmount = (goalAmount, raisedAmount) => {
    const divide = goalAmount / 100;
    const progressPercentage = raisedAmount / divide;

    progressBarFill.style = `height: ${progressPercentage}%`;
  }


  // Let the magic happen...

  getCampaign()
      .then(campaign => {
        setProgressAmount(campaign.fundraiserGoalAmount, campaign.amountRaised)
      })
      .catch(console.error);

}());
