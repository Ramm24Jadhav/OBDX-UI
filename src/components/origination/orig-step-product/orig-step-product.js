define(['ojL10n!resources/nls/strings'], function (nls) {
  function OrigStepProductViewModel(context) {
    var p = context.properties ? context.properties.params : context;
    this.nls = nls;
    this.context              = p.context;
    this.products             = p.products;
    this.selectedProduct      = p.selectedProduct;
    this.planDropdownOpen     = p.planDropdownOpen;
    this.togglePlanDropdown   = p.togglePlanDropdown;
    this.selectPlan           = p.selectPlan;
    this.isSelected           = p.isSelected;
    this.sourceAccounts       = p.sourceAccounts;
    this.sourceAccount        = p.sourceAccount;
    this.sourceDropdownOpen   = p.sourceDropdownOpen;
    this.toggleSourceDropdown = p.toggleSourceDropdown;
    this.selectSourceAccDD    = p.selectSourceAccDD;
    this.detailAmount         = p.detailAmount;
    this.detailTenure         = p.detailTenure;
    this.detailPurpose        = p.detailPurpose;
    this.detailBranch         = p.detailBranch;
    this.tenureOptions        = p.tenureOptions;
    this.selectTenure         = p.selectTenure;
    this.selectProduct        = p.selectProduct;
    this.bestReturnTip        = p.bestReturnTip;
    this.maturityCalc         = p.maturityCalc;
  }
  return OrigStepProductViewModel;
});
