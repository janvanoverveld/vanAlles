whenever sqlerror continue
drop table temp_ddl purge;

-- whenever sqlerror exit rollback

create table temp_ddl
( naam  varchar2(1000)
, code  clob
, datum date default sysdate );

set serveroutput  on
set trimspool     on
set linesize      500
set termout       on
set pages         0
set lines         1000
set feedback      off
set heading       off
set arraysize     10000
set newpage       none
set pagesize      0

spool logjn.SQL

declare
   glc_table_owner constant varchar2(200)   := 'SRG';
   glc_table_name  constant varchar2(200)   := 'X_DOCUMENT';
   glc_alias_name  constant varchar2(30)    := 'XDT';
   --
   gl_complete_ddl clob := empty_clob();
   l_sequence_name varchar2(30);
   --
   cursor c_tabs ( b_own varchar2, b_tab varchar2 )
   is
      select dt.owner
      ,      dt.table_name as nm
      from   all_tables dt
      where  dt.owner      = b_own
      and    dt.table_name = b_tab;
   --
   cursor c_col ( b_owner in varchar2, b_tabel in varchar2 )
   is
      select dtc.column_name as kolom
      ,      case when dtc.data_type = 'NUMBER' and dtc.data_precision is null then 'NUMBER'
                  when dtc.data_type = 'NUMBER' and dtc.data_precision is not null THEN 'NUMBER(' || TO_CHAR(DTC.DATA_PRECISION) || ',' || TO_CHAR(DTC.DATA_SCALE) || ')'
                  when dtc.data_type = 'VARCHAR2' THEN 'VARCHAR2('  ||TO_CHAR(DTC.DATA_LENGTH) || ')'
                  when dtc.data_type = 'DATE'     THEN 'DATE'
             end datatiepe
      , dtc.column_id as volgorde
      , max(dtc.column_id) over ( partition by dtc.owner, dtc.table_name ) as laatste_kolom
      from  all_tab_columns dtc
      where dtc.owner      = b_owner
      and   dtc.table_name = b_tabel
      order by dtc.column_id;

   l_alias                varchar2(10);
   l_kolommen             varchar2(4000);
   l_kolommen_values      varchar2(4000);
   --
   procedure print ( pinstr in varchar2 )
   is
   begin
      dbms_output.put_line(pinstr);
   end print;
   --
   procedure x ( pinstr in varchar2 )
   is
      linstr clob;
   begin
      print( pinstr );
      linstr := to_clob(pinstr || utl_tcp.crlf);
      if gl_complete_ddl is null
         or
         dbms_lob.getlength(gl_complete_ddl) = 0
      then
        gl_complete_ddl := linstr;
      else
        gl_complete_ddl := gl_complete_ddl || linstr;
      end if;
   end x;
begin
--   print( 'start                ' );
--   print( 'owner = ' || glc_table_owner );
--   print( 'tabel = ' || glc_table_name );
--   print( 'alias = ' || glc_alias_name );
   for r_tab in c_tabs ( glc_table_owner, glc_table_name )
   loop
      --print( 'start jn creation voor opgegeven tabel. ' );
      l_kolommen        := null;
      l_kolommen_values := null;
      l_sequence_name   := glc_table_owner || '_' || glc_alias_name ||'_J_ID_SEQ';
      x( 'whenever sqlerror continue' || utl_tcp.crlf );
      x( 'drop table '      || r_tab.owner     || '.' || r_tab.nm || '_jn cascade constraints;' || utl_tcp.crlf );
      x( 'drop sequence '   || glc_table_owner || '.' || l_sequence_name || utl_tcp.crlf );
      x( 'create sequence ' || glc_table_owner || '.' || l_sequence_name || utl_tcp.crlf );
      x( 'create table '    || r_tab.owner     || '.' || r_tab.nm || '_jn ( ' );
      x('  jn_id             number(9)                  not null, '    );
      x('  jn_user           varchar2(30 byte)          default user not null, '    );
      x('  jn_date_time      date                       default sysdate not null, ' );
      x('  jn_operation      varchar2(3 byte)           not null, ' );
      for r in c_col ( r_tab.owner, r_tab.nm )
      loop
         x( '  ' || rpad(r.kolom,20) || r.datatiepe || case when r.volgorde != r.laatste_kolom then ','  else ' ' end );
      end loop;
      x(');' || chr(10) || chr(10) );
      x('');
      --
      -- hieronder de trigger creatie
      --
      x('create or replace trigger ' || r_tab.owner || '.' || r_tab.owner || '_' || glc_alias_name || '_j_ar after delete or insert or update on ' || r_tab.owner || '.' || r_tab.nm || ' for each row ' );
      x('declare');
      x('  /*********************************************************************************************** ' );
      x('     doel : loggen van updates,deletes en inserts op tabel ' || r_tab.nm );
      x('     revisions: '                                );
      x('     ver         date                      author              description   ');
      x('     ---------   ------------             ---------------     ------------------------------------------------ ');
      x('     1.0         ' || replace(to_char(sysdate, 'dd-month-yyyy','nls_date_language=dutch' ),' ','' ) || ' jan van overveld           creatie  ' );
      x('  ************************************************************************************************/ ');
      x('begin');
      for r in c_col ( r_tab.owner, r_tab.nm )
      loop
         l_kolommen                := l_kolommen             || r.kolom || ', ' ;
      end loop;
      l_kolommen         := substr( l_kolommen, 1, length(l_kolommen) - 2 );
      x( '  insert into ' || r_tab.nm     || '_JN ( JN_ID, JN_OPERATION, JN_USER, ' || l_kolommen || ' ) ' );
      x( '  values ( ' || r_tab.owner || '.' || l_sequence_name || '.nextval'  );
      x( '  ,        nvl2(:NEW.ID,nvl2(:OLD.ID,''UPD'',''INS''),''DEL'') ' );
      x( '  ,        nvl(V(''APP_USER''),USER) ' );
      for r in c_col ( r_tab.owner, r_tab.nm )
      loop
         --x('  ,        nvl2(:NEW.D2A_KEY,nvl2(:OLD.D2A_KEY,:NEW.' || r.kolom || ', :OLD.' || r.kolom || '), :NEW.' || r.kolom || ')');
         x('  ,        nvl2(:new.id, :new.' || r.kolom || ', :old.' || r.kolom || ')');
      end loop;
      x( ');' );
      x( 'END '  || glc_table_owner || '_' || glc_alias_name || '_J_AR;' );
      x('/');
      insert into temp_ddl ( NAAM, CODE ) values ( r_tab.nm, gl_complete_ddl);
      commit;
   end loop;
--   print('eind');
end;
/

SPOOL OFF

SELECT *
FROM TEMP_DDL
;