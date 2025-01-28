"""Initial migration with models.

Revision ID: 42bcca336d36
Revises: 
Create Date: 2025-01-28 13:44:54.537757

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '42bcca336d36'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('user',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('username', sa.String(length=80), nullable=False),
    sa.Column('age', sa.Integer(), nullable=True),
    sa.Column('gender', sa.String(length=10), nullable=True),
    sa.Column('current_weight', sa.String(length=10), nullable=True),
    sa.Column('target_weight', sa.String(length=10), nullable=True),
    sa.Column('height', sa.String(length=10), nullable=True),
    sa.Column('profile_picture', sa.String(length=200), nullable=True),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('username')
    )
    op.create_table('workout',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=80), nullable=False),
    sa.Column('date', sa.Date(), nullable=True),
    sa.Column('duration', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['user_id'], ['user.id'], name=op.f('fk_workout_user_id_user')),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('exercise',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('workout_id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(length=80), nullable=False),
    sa.Column('weight', sa.String(length=10), nullable=True),
    sa.Column('sets', sa.String(length=10), nullable=True),
    sa.Column('reps', sa.String(length=10), nullable=True),
    sa.ForeignKeyConstraint(['workout_id'], ['workout.id'], name=op.f('fk_exercise_workout_id_workout')),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('user_exercise',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('exercise_id', sa.Integer(), nullable=False),
    sa.Column('notes', sa.String(length=200), nullable=True),
    sa.ForeignKeyConstraint(['exercise_id'], ['exercise.id'], name=op.f('fk_user_exercise_exercise_id_exercise')),
    sa.ForeignKeyConstraint(['user_id'], ['user.id'], name=op.f('fk_user_exercise_user_id_user')),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('user_exercise')
    op.drop_table('exercise')
    op.drop_table('workout')
    op.drop_table('user')
    # ### end Alembic commands ###
