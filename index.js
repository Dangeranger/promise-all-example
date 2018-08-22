const baseUrl = 'https://openstates.org/api/v1';
const apiKey = 'a39e412e-f0e2-493d-80de-ec8971d4be0b';
const getAllSponsorDetails = (sponsorList) => {
  console.log({ sponsorList });
  const sponsorDetails = sponsorList.map((sponsor) => {
    console.log({ sponsor });

    let sponsorId;
    let sponsorPath;

    if (sponsor.leg_id) {
      sponsorId = sponsor.leg_id;
      sponsorPath = 'legislators';
    } else {
      sponsorId = sponsor.committee_id;
      sponsorPath = 'committees';
    }

    const url = `${baseUrl}/${sponsorPath}/${sponsorId}/?apikey=${apiKey}`;
    console.log({url});
    return fetch(url)
      .then(res => res.json());
  });
  return Promise.all(sponsorDetails);
}

const getBillSponsors = (bill) => {
  const url = `${baseUrl}/bills/${bill.id}/?apikey=${apiKey}`;
  return fetch(url)
    .then(res => res.json())
    .then(billData => billData.sponsors);
};

// This uses Promises and Promise.all([promiseOne, promiseTwo, promiseThree])
const getSessionBillSponsors = () => {
  console.log('Hi there');
  return fetch(`${baseUrl}/bills/?state=vt&search_window=session&apikey=${apiKey}`)
    .then(res => res.json())
    .then((allBills) => {
      const billSponsors = allBills.map(bill => getBillSponsors(bill));
      return Promise.all(billSponsors);
    });
};

getSessionBillSponsors().then((results) => {
  return getAllSponsorDetails(results[0]);
}).then(details => console.log({ details }));
