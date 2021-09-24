
export const today = new Date();
export const interNat = (new Intl.DateTimeFormat('en-US', {month: 'long'}))
const localise = p => (today(p)).toLocaleDateString();
const replacer = data => data.replace(/[^0-9-]/g, '-');
const localiseAndReplace = p => replacer(localise(p));
export const shortDay = () => localiseAndReplace(today);


const day = today.getDate()
const hours = today.getHours()
const mins = today.getMinutes()
export const uniqueValue = day + hours + mins * 3
