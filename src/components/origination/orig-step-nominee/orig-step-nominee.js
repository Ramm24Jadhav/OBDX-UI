define(['ojL10n!resources/nls/strings'], function (nls) {
  function OrigStepNomineeViewModel(context) {
    var p = context.properties ? context.properties.params : context;
    this.nls = nls;
    this.addNominee               = p.addNominee;
    this.nominationType           = p.nominationType;
    this.nomineeName              = p.nomineeName;
    this.nomineeDOB               = p.nomineeDOB;
    this.nomineeRelationship      = p.nomineeRelationship;
    this.nomineeAddress           = p.nomineeAddress;
    this.nomineeCountry           = p.nomineeCountry;
    this.nomineeState             = p.nomineeState;
    this.nomineeCity              = p.nomineeCity;
    this.nomineeZip               = p.nomineeZip;
    this.isMinor                  = p.isMinor;
    this.guardianName             = p.guardianName;
    this.guardianAddress          = p.guardianAddress;
    this.guardianCountry          = p.guardianCountry;
    this.guardianState            = p.guardianState;
    this.guardianCity             = p.guardianCity;
    this.guardianZip              = p.guardianZip;
    this.existingNominees         = p.existingNominees;
    this.selectedExistingNominee  = p.selectedExistingNominee;
    this.nomineeDropdownOpen      = p.nomineeDropdownOpen;
    this.toggleNomineeDropdown    = p.toggleNomineeDropdown;
    this.selectExistingNomineeDD  = p.selectExistingNomineeDD;
  }
  return OrigStepNomineeViewModel;
});
