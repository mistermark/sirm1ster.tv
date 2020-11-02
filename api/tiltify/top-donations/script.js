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
  const TILTIFY_USERID = urlParams['user'];
  const TILTIFY_TEAMID = urlParams['team'];
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

  const mockDonations = {
    "meta": {
      "status": 200
    },
    "data": [
      {
        "id": 21347,
        "amount": 8.00,
        "name": "Yoda",
        "comment": "Judge me by my size, do you?",
        "completedAt": 1490328000000,
        "rewardId": 12
      },
      {
        "id": 21342,
        "amount": 5.00,
        "name": "Luke",
        "comment": "This is an easy Game",
        "completedAt": 1490327800000
      },
      {
        "id": 21342,
        "amount": 25.00,
        "name": "John",
        "comment": "This is an easy Game",
        "completedAt": 1490327800000
      },
      {
        "id": 21342,
        "amount": 100.00,
        "name": "Darth Vader",
        "comment": "This is an easy Game",
        "completedAt": 1490327800000
      },
      {
        "id": 21342,
        "amount": 12.00,
        "name": "Obi Wan",
        "comment": "This is an easy Game",
        "completedAt": 1490327800000
      },
      {
        "id": 21342,
        "amount": 0.50,
        "name": "Palpatine",
        "comment": "This is an easy Game",
        "completedAt": 1490327800000
      },
      {
        "id": 21342,
        "amount": 35.00,
        "name": "Leia",
        "comment": "This is an easy Game",
        "completedAt": 1490327800000
      },
    ],
    "links": {
      "prev": "",
      "next": "",
      "self": ""
    }
  };

  // STORE

  const donationsListOutput = document.getElementById('donations-list');
  const donationsTitle = document.getElementById('title');

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

  const _sortJSON = (arr, key) => {
    arr.sort((a,b) => {
        var x = a[key] < b[key] ? -1:1;
        return x;
    });
    return arr;
  }

  const getUser = () => {
    return _fetchAPI(TILTIFY_API.user)
      .then((json) => {
        return json.data;
      })
  };

  const getUserTeams = () => {
    return _fetchAPI(`/users/${TILTIFY_USERID}/teams`)
      .then((json) => {
        return json.data;
      })

  }

  const getTeamCampaigns = () => {
    return _fetchAPI(`/teams/${TILTIFY_TEAMID}/campaigns`)
    .then((json) => {
      return json.data;
    })
  }

  const getCampaignDonations = (progress, url = `${TILTIFY_API.base}/api/v3/campaigns/${TILTIFY_CAMPAIGNID}/donations?count=100`, donations = []) => {
    return new Promise((resolve, reject) => fetch(url, API_OPTIONS)
      .then(response => {
        if(response.status !== 200) {
          throw `${response.status}: ${response.statusText}`;
        }
        response.json().then(data => {
          donations = donations.concat(data.data);
          // donations = donations.concat(mockDonations.data);

          donations = _sortJSON(donations, 'amount');

          if(donations.length > 99 && data.links.next.indexOf('&after=') !== -1) {
            progress && progress(donations);
            getCampaignDonations(progress, data.links.next, donations).then(resolve).catch(reject);
          } else {
            resolve(donations);
          }
        }).catch(reject);
      }).catch(reject))
  }

    const progressCallback = (donations) => {
      console.log(`${donations.length} loaded`);
    }


  // Let the magic happen...

  if(LIST_TITLE)
    donationsTitle.innerText = LIST_TITLE;

  getCampaignDonations(progressCallback)
      .then(donations => {
        const donationsList = document.createElement('ol');

        const topDonations = donations.slice(0, 5);

        for (let i = 0; i < topDonations.length; i++) {
          const donationItem = document.createElement('li');

          donationItem.appendChild(_createElementFromHTML(`<span class="donator">${topDonations[i].name}:</span>`));
          donationItem.appendChild(_createElementFromHTML(`<span class="amount">$${topDonations[i].amount}</span>`));
          donationsList.insertBefore(donationItem, donationsList.childNodes[0] || null);
        }
        donationsListOutput.appendChild(donationsList);
      })
      .catch(console.error);

  // getCampaignDonations().then((donations) => {
  //   console.log(donations);
  //   listDonations.push(donations);
  //   return donations;
  // })
  // .then((donations) => {
  //   if(donations.links.next) {
  //     console.log(listDonations);
  //   }
  // })

}());
