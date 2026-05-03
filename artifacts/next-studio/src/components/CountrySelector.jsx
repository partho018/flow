"use client";
import { useState, useRef, useEffect } from "react";
import { Search, ChevronDown, Check } from "lucide-react";

export const COUNTRIES = [
  { name: "Afghanistan", code: "AF", dialCode: "+93" },
  { name: "Albania", code: "AL", dialCode: "+355" },
  { name: "Algeria", code: "DZ", dialCode: "+213" },
  { name: "Andorra", code: "AD", dialCode: "+376" },
  { name: "Angola", code: "AO", dialCode: "+244" },
  { name: "Antigua and Barbuda", code: "AG", dialCode: "+1" },
  { name: "Argentina", code: "AR", dialCode: "+54" },
  { name: "Armenia", code: "AM", dialCode: "+374" },
  { name: "Australia", code: "AU", dialCode: "+61" },
  { name: "Austria", code: "AT", dialCode: "+43" },
  { name: "Azerbaijan", code: "AZ", dialCode: "+994" },
  { name: "Bahamas", code: "BS", dialCode: "+1" },
  { name: "Bahrain", code: "BH", dialCode: "+973" },
  { name: "Bangladesh", code: "BD", dialCode: "+880" },
  { name: "Barbados", code: "BB", dialCode: "+1" },
  { name: "Belarus", code: "BY", dialCode: "+375" },
  { name: "Belgium", code: "BE", dialCode: "+32" },
  { name: "Belize", code: "BZ", dialCode: "+501" },
  { name: "Benin", code: "BJ", dialCode: "+229" },
  { name: "Bhutan", code: "BT", dialCode: "+975" },
  { name: "Bolivia", code: "BO", dialCode: "+591" },
  { name: "Bosnia and Herzegovina", code: "BA", dialCode: "+387" },
  { name: "Botswana", code: "BW", dialCode: "+267" },
  { name: "Brazil", code: "BR", dialCode: "+55" },
  { name: "Brunei", code: "BN", dialCode: "+673" },
  { name: "Bulgaria", code: "BG", dialCode: "+359" },
  { name: "Burkina Faso", code: "BF", dialCode: "+226" },
  { name: "Burundi", code: "BI", dialCode: "+257" },
  { name: "Cambodia", code: "KH", dialCode: "+855" },
  { name: "Cameroon", code: "CM", dialCode: "+237" },
  { name: "Canada", code: "CA", dialCode: "+1" },
  { name: "Cape Verde", code: "CV", dialCode: "+238" },
  { name: "Central African Republic", code: "CF", dialCode: "+236" },
  { name: "Chad", code: "TD", dialCode: "+235" },
  { name: "Chile", code: "CL", dialCode: "+56" },
  { name: "China", code: "CN", dialCode: "+86" },
  { name: "Colombia", code: "CO", dialCode: "+57" },
  { name: "Comoros", code: "KM", dialCode: "+269" },
  { name: "Congo", code: "CG", dialCode: "+242" },
  { name: "Costa Rica", code: "CR", dialCode: "+506" },
  { name: "Croatia", code: "HR", dialCode: "+385" },
  { name: "Cuba", code: "CU", dialCode: "+53" },
  { name: "Cyprus", code: "CY", dialCode: "+357" },
  { name: "Czech Republic", code: "CZ", dialCode: "+420" },
  { name: "Denmark", code: "DK", dialCode: "+45" },
  { name: "Djibouti", code: "DJ", dialCode: "+253" },
  { name: "Dominica", code: "DM", dialCode: "+1" },
  { name: "Dominican Republic", code: "DO", dialCode: "+1" },
  { name: "East Timor", code: "TL", dialCode: "+670" },
  { name: "Ecuador", code: "EC", dialCode: "+593" },
  { name: "Egypt", code: "EG", dialCode: "+20" },
  { name: "El Salvador", code: "SV", dialCode: "+503" },
  { name: "Equatorial Guinea", code: "GQ", dialCode: "+240" },
  { name: "Eritrea", code: "ER", dialCode: "+291" },
  { name: "Estonia", code: "EE", dialCode: "+372" },
  { name: "Ethiopia", code: "ET", dialCode: "+251" },
  { name: "Fiji", code: "FJ", dialCode: "+679" },
  { name: "Finland", code: "FI", dialCode: "+358" },
  { name: "France", code: "FR", dialCode: "+33" },
  { name: "Gabon", code: "GA", dialCode: "+241" },
  { name: "Gambia", code: "GM", dialCode: "+220" },
  { name: "Georgia", code: "GE", dialCode: "+995" },
  { name: "Germany", code: "DE", dialCode: "+49" },
  { name: "Ghana", code: "GH", dialCode: "+233" },
  { name: "Greece", code: "GR", dialCode: "+30" },
  { name: "Grenada", code: "GD", dialCode: "+1" },
  { name: "Guatemala", code: "GT", dialCode: "+502" },
  { name: "Guinea", code: "GN", dialCode: "+224" },
  { name: "Guinea-Bissau", code: "GW", dialCode: "+245" },
  { name: "Guyana", code: "GY", dialCode: "+592" },
  { name: "Haiti", code: "HT", dialCode: "+509" },
  { name: "Honduras", code: "HN", dialCode: "+504" },
  { name: "Hungary", code: "HU", dialCode: "+36" },
  { name: "Iceland", code: "IS", dialCode: "+354" },
  { name: "India", code: "IN", dialCode: "+91" },
  { name: "Indonesia", code: "ID", dialCode: "+62" },
  { name: "Iran", code: "IR", dialCode: "+98" },
  { name: "Iraq", code: "IQ", dialCode: "+964" },
  { name: "Ireland", code: "IE", dialCode: "+353" },
  { name: "Israel", code: "IL", dialCode: "+972" },
  { name: "Italy", code: "IT", dialCode: "+39" },
  { name: "Ivory Coast", code: "CI", dialCode: "+225" },
  { name: "Jamaica", code: "JM", dialCode: "+1" },
  { name: "Japan", code: "JP", dialCode: "+81" },
  { name: "Jordan", code: "JO", dialCode: "+962" },
  { name: "Kazakhstan", code: "KZ", dialCode: "+7" },
  { name: "Kenya", code: "KE", dialCode: "+254" },
  { name: "Kiribati", code: "KI", dialCode: "+686" },
  { name: "Korea, North", code: "KP", dialCode: "+850" },
  { name: "Korea, South", code: "KR", dialCode: "+82" },
  { name: "Kuwait", code: "KW", dialCode: "+965" },
  { name: "Kyrgyzstan", code: "KG", dialCode: "+996" },
  { name: "Laos", code: "LA", dialCode: "+856" },
  { name: "Latvia", code: "LV", dialCode: "+371" },
  { name: "Lebanon", code: "LB", dialCode: "+961" },
  { name: "Lesotho", code: "LS", dialCode: "+266" },
  { name: "Liberia", code: "LR", dialCode: "+231" },
  { name: "Libya", code: "LY", dialCode: "+218" },
  { name: "Liechtenstein", code: "LI", dialCode: "+423" },
  { name: "Lithuania", code: "LT", dialCode: "+370" },
  { name: "Luxembourg", code: "LU", dialCode: "+352" },
  { name: "Macedonia", code: "MK", dialCode: "+389" },
  { name: "Madagascar", code: "MG", dialCode: "+261" },
  { name: "Malawi", code: "MW", dialCode: "+265" },
  { name: "Malaysia", code: "MY", dialCode: "+60" },
  { name: "Maldives", code: "MV", dialCode: "+960" },
  { name: "Mali", code: "ML", dialCode: "+223" },
  { name: "Malta", code: "MT", dialCode: "+356" },
  { name: "Marshall Islands", code: "MH", dialCode: "+692" },
  { name: "Mauritania", code: "MR", dialCode: "+222" },
  { name: "Mauritius", code: "MU", dialCode: "+230" },
  { name: "Mexico", code: "MX", dialCode: "+52" },
  { name: "Micronesia", code: "FM", dialCode: "+691" },
  { name: "Moldova", code: "MD", dialCode: "+373" },
  { name: "Monaco", code: "MC", dialCode: "+377" },
  { name: "Mongolia", code: "MN", dialCode: "+976" },
  { name: "Montenegro", code: "ME", dialCode: "+382" },
  { name: "Morocco", code: "MA", dialCode: "+212" },
  { name: "Mozambique", code: "MZ", dialCode: "+258" },
  { name: "Myanmar", code: "MM", dialCode: "+95" },
  { name: "Namibia", code: "NA", dialCode: "+264" },
  { name: "Nauru", code: "NR", dialCode: "+674" },
  { name: "Nepal", code: "NP", dialCode: "+977" },
  { name: "Netherlands", code: "NL", dialCode: "+31" },
  { name: "New Zealand", code: "NZ", dialCode: "+64" },
  { name: "Nicaragua", code: "NI", dialCode: "+505" },
  { name: "Niger", code: "NE", dialCode: "+227" },
  { name: "Nigeria", code: "NG", dialCode: "+234" },
  { name: "Norway", code: "NO", dialCode: "+47" },
  { name: "Oman", code: "OM", dialCode: "+968" },
  { name: "Pakistan", code: "PK", dialCode: "+92" },
  { name: "Palau", code: "PW", dialCode: "+680" },
  { name: "Panama", code: "PA", dialCode: "+507" },
  { name: "Papua New Guinea", code: "PG", dialCode: "+675" },
  { name: "Paraguay", code: "PY", dialCode: "+595" },
  { name: "Peru", code: "PE", dialCode: "+51" },
  { name: "Philippines", code: "PH", dialCode: "+63" },
  { name: "Poland", code: "PL", dialCode: "+48" },
  { name: "Portugal", code: "PT", dialCode: "+351" },
  { name: "Qatar", code: "QA", dialCode: "+974" },
  { name: "Romania", code: "RO", dialCode: "+40" },
  { name: "Russia", code: "RU", dialCode: "+7" },
  { name: "Rwanda", code: "RW", dialCode: "+250" },
  { name: "Saint Kitts and Nevis", code: "KN", dialCode: "+1" },
  { name: "Saint Lucia", code: "LC", dialCode: "+1" },
  { name: "Saint Vincent and the Grenadines", code: "VC", dialCode: "+1" },
  { name: "Samoa", code: "WS", dialCode: "+685" },
  { name: "San Marino", code: "SM", dialCode: "+378" },
  { name: "Sao Tome and Principe", code: "ST", dialCode: "+239" },
  { name: "Saudi Arabia", code: "SA", dialCode: "+966" },
  { name: "Senegal", code: "SN", dialCode: "+221" },
  { name: "Serbia", code: "RS", dialCode: "+381" },
  { name: "Seychelles", code: "SC", dialCode: "+248" },
  { name: "Sierra Leone", code: "SL", dialCode: "+232" },
  { name: "Singapore", code: "SG", dialCode: "+65" },
  { name: "Slovakia", code: "SK", dialCode: "+421" },
  { name: "Slovenia", code: "SI", dialCode: "+386" },
  { name: "Solomon Islands", code: "SB", dialCode: "+677" },
  { name: "Somalia", code: "SO", dialCode: "+252" },
  { name: "South Africa", code: "ZA", dialCode: "+27" },
  { name: "South Sudan", code: "SS", dialCode: "+211" },
  { name: "Spain", code: "ES", dialCode: "+34" },
  { name: "Sri Lanka", code: "LK", dialCode: "+94" },
  { name: "Sudan", code: "SD", dialCode: "+249" },
  { name: "Suriname", code: "SR", dialCode: "+597" },
  { name: "Swaziland", code: "SZ", dialCode: "+268" },
  { name: "Sweden", code: "SE", dialCode: "+46" },
  { name: "Switzerland", code: "CH", dialCode: "+41" },
  { name: "Syria", code: "SY", dialCode: "+963" },
  { name: "Taiwan", code: "TW", dialCode: "+886" },
  { name: "Tajikistan", code: "TJ", dialCode: "+992" },
  { name: "Tanzania", code: "TZ", dialCode: "+255" },
  { name: "Thailand", code: "TH", dialCode: "+66" },
  { name: "Togo", code: "TG", dialCode: "+228" },
  { name: "Tonga", code: "TO", dialCode: "+676" },
  { name: "Trinidad and Tobago", code: "TT", dialCode: "+1" },
  { name: "Tunisia", code: "TN", dialCode: "+216" },
  { name: "Turkey", code: "TR", dialCode: "+90" },
  { name: "Turkmenistan", code: "TM", dialCode: "+993" },
  { name: "Tuvalu", code: "TV", dialCode: "+688" },
  { name: "Uganda", code: "UG", dialCode: "+256" },
  { name: "Ukraine", code: "UA", dialCode: "+380" },
  { name: "United Arab Emirates", code: "AE", dialCode: "+971" },
  { name: "United Kingdom", code: "GB", dialCode: "+44" },
  { name: "United States", code: "US", dialCode: "+1" },
  { name: "Uruguay", code: "UY", dialCode: "+598" },
  { name: "Uzbekistan", code: "UZ", dialCode: "+998" },
  { name: "Vanuatu", code: "VU", dialCode: "+678" },
  { name: "Vatican City", code: "VA", dialCode: "+379" },
  { name: "Venezuela", code: "VE", dialCode: "+58" },
  { name: "Vietnam", code: "VN", dialCode: "+84" },
  { name: "Yemen", code: "YE", dialCode: "+967" },
  { name: "Zambia", code: "ZM", dialCode: "+260" },
  { name: "Zimbabwe", code: "ZW", dialCode: "+263" }
];

const getFlagUrl = (code) => `https://flagcdn.com/w40/${code.toLowerCase()}.png`;

export function CountrySelector({ value, onChange, error }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef(null);

  const selectedCountry = COUNTRIES.find(c => c.name === value);

  const filteredCountries = COUNTRIES.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.dialCode.includes(searchQuery)
  );

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`group flex items-center justify-between px-4 py-3.5 rounded-2xl border cursor-pointer transition-all duration-200 ${
          error 
            ? 'border-destructive bg-destructive/5' 
            : 'border-border bg-background hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5'
        } ${isOpen ? 'border-primary ring-2 ring-primary/10 shadow-lg shadow-primary/5' : ''}`}
      >
        <div className="flex items-center gap-2.5">
          {selectedCountry && (
            <img 
              src={getFlagUrl(selectedCountry.code)} 
              alt="" 
              className="w-5 h-3.5 object-cover rounded-sm shadow-sm" 
            />
          )}
          <span className={`text-sm font-bold transition-colors ${value ? 'text-foreground' : 'text-muted-foreground'}`}>
            {value || "Select Country"}
          </span>
        </div>
        <ChevronDown size={18} className={`text-muted-foreground transition-all duration-300 ${isOpen ? 'rotate-180 text-primary' : 'group-hover:text-primary/70'}`} />
      </div>

      {isOpen && (
        <div className="absolute z-[100] mt-3 w-full bg-card border border-border rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300 backdrop-blur-xl">
          <div className="p-3 border-b border-border bg-muted/20">
            <div className="relative group">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={14} />
              <input
                autoFocus
                type="text"
                placeholder="Search country name or code..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-xl text-xs font-bold outline-none focus:border-primary transition-all placeholder:text-muted-foreground/50"
              />
            </div>
          </div>
          <div className="max-h-[280px] overflow-y-auto py-2 custom-scrollbar">
            {filteredCountries.length > 0 ? (
              filteredCountries.map((c) => (
                <div
                  key={c.code}
                  onClick={() => {
                    onChange(c);
                    setIsOpen(false);
                    setSearchQuery("");
                  }}
                  className={`flex items-center justify-between px-4 py-3 cursor-pointer transition-all duration-200 ${
                    value === c.name 
                      ? 'bg-primary text-primary-foreground' 
                      : 'text-foreground hover:bg-primary/10 hover:pl-6'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img 
                      src={getFlagUrl(c.code)} 
                      alt="" 
                      className="w-5 h-3.5 object-cover rounded-sm shadow-sm" 
                    />
                    <div className="flex flex-col">
                      <span className="text-sm font-black tracking-tight">{c.name}</span>
                    </div>
                  </div>
                  {value === c.name && <Check size={16} className="text-primary-foreground" />}
                </div>
              ))
            ) : (
              <div className="px-4 py-12 text-center flex flex-col items-center gap-3">
                <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                  <Search size={16} className="text-muted-foreground" />
                </div>
                <p className="text-xs text-muted-foreground font-black uppercase tracking-widest">No results found</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export function PhoneInput({ value, country, onPhoneChange, onCountryChange, error }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef(null);
  
  const selectedCountry = COUNTRIES.find(c => c.name === country) || COUNTRIES[0];

  const filteredCountries = COUNTRIES.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.dialCode.includes(searchQuery) ||
    c.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`flex items-center rounded-2xl border transition-all duration-200 group relative ${
      error 
        ? 'border-destructive bg-destructive/5' 
        : 'border-border bg-background focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10 focus-within:shadow-lg focus-within:shadow-primary/5 hover:border-primary/30'
    }`}>
      {/* Country Code Selector */}
      <div className="relative" ref={dropdownRef}>
        <div 
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-4 py-3.5 bg-muted/30 border-r border-border cursor-pointer hover:bg-primary/5 transition-colors"
        >
          <img 
            src={getFlagUrl(selectedCountry.code)} 
            alt="" 
            className="w-5 h-3.5 object-cover rounded-sm shadow-sm mr-0.5" 
          />
          <ChevronDown size={12} className={`text-muted-foreground transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          <span className="ml-0.5 text-primary font-black">{selectedCountry.dialCode}</span>
        </div>

        {isOpen && (
          <div className="absolute z-[110] left-0 mt-3 w-[280px] bg-card border border-border rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="p-2 border-b border-border bg-muted/20">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={12} />
                <input
                  autoFocus
                  type="text"
                  placeholder="Search code..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 bg-background border border-border rounded-xl text-[11px] font-bold outline-none focus:border-primary"
                />
              </div>
            </div>
            <div className="max-h-[200px] overflow-y-auto py-1 custom-scrollbar">
              {filteredCountries.map((c) => (
                <div
                  key={c.code}
                  onClick={() => {
                    onCountryChange(c);
                    setIsOpen(false);
                    setSearchQuery("");
                  }}
                  className={`flex items-center justify-between px-3 py-2 cursor-pointer transition-all ${
                    country === c.name ? 'bg-primary text-primary-foreground' : 'hover:bg-primary/10'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <img 
                      src={getFlagUrl(c.code)} 
                      alt="" 
                      className="w-5 h-3.5 object-cover rounded-sm shadow-sm" 
                    />
                    <span className={`text-[10px] font-bold ${country === c.name ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>{c.name}</span>
                  </div>
                  <span className="text-[11px] font-black">{c.dialCode}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <input
        type="tel"
        placeholder="Phone number"
        value={value}
        onChange={(e) => onPhoneChange(e.target.value)}
        className="flex-1 px-5 py-3.5 text-sm font-black bg-transparent outline-none placeholder:text-muted-foreground/30 placeholder:font-bold tracking-tight"
      />
    </div>
  );
}
