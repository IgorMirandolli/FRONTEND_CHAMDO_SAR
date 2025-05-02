import moment from 'moment'

let lang     = ''
let currency = ''
let dateF     = ''

if (navigator.language.includes('pt')===true){
  lang=navigator.language
  currency= 'BRL'
  dateF = 'DD/MM/YYYY'
} else if (navigator.language.includes('it')===true){
  lang=navigator.language
  currency= '	EUR'
  dateF = 'DD/MM/YYYY'
}else if (navigator.language.includes('es')===true){
  lang=navigator.language
  currency= '	EUR'
  dateF = 'DD/MM/YYYY'
}else if (navigator.language.includes('en')===true){
  lang=navigator.language
  currency= 'USD'
  dateF = 'YYYY/MM/DD'
} else{
  lang='en-US'
  currency= 'USD'
  dateF = 'YYYY/MM/DD'
}

const formatPhone = (phone) => {
  if (!phone) return "";
  
  const cleaned = phone.replace(/\D/g, ""); // Remove tudo que não for número

  if (cleaned.length === 11) {
    // Formato para celulares (99) 99999-9999
    return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  } else if (cleaned.length === 10) {
    // Formato para fixo (99) 9999-9999
    return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
  } else {
    return phone; // Retorna sem mudanças se não for um telefone válido
  }
};


const formatDt = (curr) => {
  if (curr === null || curr === undefined){
    return 
  }   
  
  return moment(curr).format(dateF)

}

const formatCurrency = (curr) => {

  if (curr === null || curr === undefined){
    return 
  }  
  const formatted = curr.toLocaleString(lang, {
    style: 'currency',
    currency: currency
  })  
    return formatted

  }
  
  export {    
    formatCurrency, 
    formatDt,    
    formatPhone
  }