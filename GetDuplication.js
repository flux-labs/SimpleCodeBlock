var modeling = require('flux-modelingjs').modeling();
function run(obj) {
  return {
      newObj: JSON.parse(JSON.stringify(obj))
  };
}
module.exports = {
    run: run
};