define([], function () {
  function OrigStepMaturityViewModel(context) {
    var p = context.properties ? context.properties.params : context;
    this.maturityInstruction    = p.maturityInstruction;
    this.maturityOptions        = p.maturityOptions;
    this.rolloverAmount         = p.rolloverAmount;
    this.showRollover           = p.showRollover;
    this.showPayTo              = p.showPayTo;
    this.payToMode              = p.payToMode;
    this.payToOptions           = p.payToOptions;
    this.payToOwnAccounts       = p.payToOwnAccounts;
    this.payToOwnAccount        = p.payToOwnAccount;
    this.payToOwnDropdownOpen   = p.payToOwnDropdownOpen;
    this.togglePayToOwnDropdown = p.togglePayToOwnDropdown;
    this.selectPayToOwnAcc      = p.selectPayToOwnAcc;
    this.payToInternalAccNo     = p.payToInternalAccNo;
    this.payToInternalAccHolder = p.payToInternalAccHolder;
    this.payToInternalBankName  = p.payToInternalBankName;
  }
  return OrigStepMaturityViewModel;
});
