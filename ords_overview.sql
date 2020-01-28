

SELECT oss.parsing_schema, mod.uri_prefix as service_version, hdl.method, tpl.uri_template
, 'http://servername:8080/ords/' || oum.pattern || mod.uri_prefix || tpl.uri_template as restUrl2
, hdl.source
FROM   ords_metadata.ords_schemas oss join ords_metadata.ords_modules      mod on ( mod.schema_id = oss.id )
                                      join ORDS_METADATA.ords_templates    tpl on ( tpl.module_id = mod.id )
                                      join ORDS_METADATA.ords_handlers     hdl on ( hdl.template_id = tpl.id )
                                      join ORDS_METADATA.ORDS_URL_MAPPINGS oum on ( oss.url_mapping_id = oum.id )
order by oss.parsing_schema, hdl.method, tpl.uri_template                                           
;                                           
